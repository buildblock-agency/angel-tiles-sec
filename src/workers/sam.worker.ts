let model: any = null;
let processor: any = null;
let currentEmbeddings: any = null;
let currentRawImage: any = null;
let currentInputs: any = null;
let currentImageKey: string | null = null;

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  try {
    if (type === 'load') {
      await loadModel();
      (self as any).postMessage({ type: 'loaded' });
    } else if (type === 'embed') {
      const { imageUrl, imageKey } = payload;
      await embedImage(imageUrl, imageKey);
      (self as any).postMessage({ type: 'embedded', imageKey });
    } else if (type === 'segment') {
      const { x, y, imageKey } = payload;
      const result = await segment(x, y, imageKey);
      (self as any).postMessage({ type: 'segmented', result });
    }
  } catch (err: any) {
    (self as any).postMessage({
      type: 'error',
      stage: type,
      message: err?.message || String(err),
    });
  }
};

async function loadModel() {
  if (model && processor) return;

  // Dynamic import ensures env is configured before the ONNX Runtime backend
  // is initialized, avoiding SharedArrayBuffer / cross-origin isolation issues.
  const { env } = await import('@xenova/transformers');
  env.backends.onnx.wasm.numThreads = 1;
  env.backends.onnx.wasm.proxy = false;
  env.allowLocalModels = false;
  env.allowRemoteModels = true;

  (self as any).postMessage({ type: 'progress', percent: 10, message: 'Downloading Segment Anything AI...' });

  const { SamModel, AutoProcessor } = await import('@xenova/transformers');

  (self as any).postMessage({ type: 'progress', percent: 30, message: 'Loading SlimSAM processor...' });
  processor = await AutoProcessor.from_pretrained('Xenova/slimsam-77-uniform');

  (self as any).postMessage({ type: 'progress', percent: 60, message: 'Loading SlimSAM vision encoder...' });
  model = await SamModel.from_pretrained('Xenova/slimsam-77-uniform', {
    dtype: {
      vision_encoder: 'fp32',
      prompt_encoder_mask_decoder: 'fp32',
    },
  } as any);

  (self as any).postMessage({ type: 'progress', percent: 85, message: 'AI model ready' });
}

async function embedImage(imageUrl: string, imageKey: string) {
  if (currentImageKey === imageKey && currentEmbeddings) {
    (self as any).postMessage({ type: 'progress', percent: 100, message: 'Using cached geometry' });
    return;
  }

  (self as any).postMessage({ type: 'progress', percent: 88, message: 'Analyzing room geometry...' });

  const { RawImage } = await import('@xenova/transformers');

  let fullUrl = imageUrl;
  if (imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) {
    fullUrl = imageUrl;
  } else {
    try {
      if (typeof self !== 'undefined' && self.location && self.location.origin) {
        fullUrl = new URL(imageUrl, self.location.origin).href;
      }
    } catch (e) {}
  }

  const rawImage = await RawImage.read(fullUrl);
  const inputs = await processor(rawImage);
  const imageEmbeddings = await model.get_image_embeddings(inputs);

  currentRawImage = rawImage;
  currentInputs = inputs;
  currentEmbeddings = imageEmbeddings;
  currentImageKey = imageKey;

  (self as any).postMessage({ type: 'progress', percent: 100, message: 'Ready for material application' });
}

async function segment(xVal: number, yVal: number, imageKey: string) {
  if (currentImageKey !== imageKey || !currentEmbeddings) {
    throw new Error('No cached embedding for this image — call embed first.');
  }

  let x: number;
  let y: number;

  if (xVal <= 1 && yVal <= 1 && xVal >= 0 && yVal >= 0) {
    x = Math.round(xVal * currentRawImage.width);
    y = Math.round(yVal * currentRawImage.height);
  } else {
    const origW = currentInputs.original_sizes?.[0]?.[1] || currentRawImage.width;
    const origH = currentInputs.original_sizes?.[0]?.[0] || currentRawImage.height;
    x = Math.round((xVal / origW) * currentRawImage.width);
    y = Math.round((yVal / origH) * currentRawImage.height);
  }

  x = Math.max(0, Math.min(currentRawImage.width - 1, x));
  y = Math.max(0, Math.min(currentRawImage.height - 1, y));

  const input_points = [[[[x, y]]]];
  const input_labels = [[[1]]];

  const prompt_inputs = await processor(currentRawImage, input_points, input_labels);

  const outputs = await model({
    ...currentEmbeddings,
    ...prompt_inputs,
  });

  const masks = await processor.post_process_masks(
    outputs.pred_masks,
    currentInputs.original_sizes,
    currentInputs.reshaped_input_sizes
  );

  let bestMaskIdx = 0;
  if (outputs.iou_scores) {
    const scores = outputs.iou_scores.data;
    let maxScore = -Infinity;
    for (let i = 0; i < scores.length; i++) {
      if (scores[i] > maxScore) {
        maxScore = scores[i];
        bestMaskIdx = i;
      }
    }
  }

  const maskTensor = masks[0];
  return {
    data: Array.from(maskTensor.data as Uint8Array | Float32Array),
    dims: maskTensor.dims,
    bestMaskIdx,
  };
}

export {};

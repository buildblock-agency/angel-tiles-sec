// src/hooks/useSamWorker.ts
//
// Wraps the SAM Web Worker in a simple async API so VisualizerClient.tsx
// barely has to change. Main thread stays free — the worker handles all
// the heavy lifting.

import { useRef, useCallback, useEffect } from 'react';

interface SegmentResult {
  data: number[];
  dims: number[];
  bestMaskIdx: number;
}

export function useSamWorker(
  onProgress: (percent: number, message: string) => void
) {
  const workerRef = useRef<Worker | null>(null);
  const pendingRef = useRef<Map<string, { resolve: (v: any) => void; reject: (e: any) => void }>>(new Map());
  const onProgressRef = useRef(onProgress);

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    const worker = new Worker(new URL('../workers/sam.worker.ts', import.meta.url));
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent) => {
      const { type } = e.data;

      if (type === 'progress') {
        onProgressRef.current(e.data.percent, e.data.message);
        return;
      }

      if (type === 'loaded') {
        pendingRef.current.get('load')?.resolve(undefined);
        pendingRef.current.delete('load');
      } else if (type === 'embedded') {
        pendingRef.current.get('embed')?.resolve(undefined);
        pendingRef.current.delete('embed');
      } else if (type === 'segmented') {
        pendingRef.current.get('segment')?.resolve(e.data.result);
        pendingRef.current.delete('segment');
      } else if (type === 'error') {
        const key = e.data.stage;
        pendingRef.current.get(key)?.reject(new Error(e.data.message));
        pendingRef.current.delete(key);
      }
    };

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const load = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      pendingRef.current.set('load', { resolve, reject });
      workerRef.current?.postMessage({ type: 'load' });
    });
  }, []);

  const embed = useCallback((imageUrl: string, imageKey: string) => {
    return new Promise<void>((resolve, reject) => {
      pendingRef.current.set('embed', { resolve, reject });
      workerRef.current?.postMessage({ type: 'embed', payload: { imageUrl, imageKey } });
    });
  }, []);

  const segment = useCallback((x: number, y: number, imageKey: string) => {
    return new Promise<SegmentResult>((resolve, reject) => {
      pendingRef.current.set('segment', { resolve, reject });
      workerRef.current?.postMessage({ type: 'segment', payload: { x, y, imageKey } });
    });
  }, []);

  return { load, embed, segment };
}

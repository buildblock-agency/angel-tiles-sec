'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Upload, Download, ArrowLeft, RotateCcw, Check, Phone, Eye } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PRODUCTS, Product } from '@/content/products';

interface Point {
  x: number;
  y: number;
}

const PRESET_ROOMS = [
  { id: 'lobby', name: 'Luxury Lobby Floor', url: '/presets/preset_lobby_floor.webp' },
  { id: 'living', name: 'Modern Living Floor', url: '/presets/preset_living_floor.webp' },
  { id: 'bedroom', name: 'Spacious Bed Floor', url: '/presets/preset_bedroom_floor.webp' },
  { id: 'wall', name: 'Bath Feature Wall', url: '/presets/preset_bathroom_wall.webp' },
];

export default function VisualizerClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [selectedRoom, setSelectedRoom] = useState(PRESET_ROOMS[0].url);
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [points, setPoints] = useState<Point[]>([
    { x: 0.2, y: 0.6 }, // Top-Left
    { x: 0.8, y: 0.6 }, // Top-Right
    { x: 0.9, y: 0.85 }, // Bottom-Right
    { x: 0.1, y: 0.85 }, // Bottom-Left
  ]);
  const [activePoint, setActivePoint] = useState<number | null>(null);
  const [isWarping, setIsWarping] = useState(true);
  const [viewMode, setViewMode] = useState<'after' | 'before'>('after');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Assets refs
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);
  const textureImageRef = useRef<HTMLImageElement | null>(null);

  // 1. Load background image and selected texture
  useEffect(() => {
    const bgImg = new window.Image();
    bgImg.src = selectedRoom;
    bgImg.crossOrigin = 'anonymous';
    bgImg.onload = () => {
      backgroundImageRef.current = bgImg;
      drawCanvas();
    };

    const texImg = new window.Image();
    texImg.src = selectedProduct.texture;
    texImg.crossOrigin = 'anonymous';
    texImg.onload = () => {
      textureImageRef.current = texImg;
      drawCanvas();
    };
  }, [selectedRoom, selectedProduct]);

  // 2. Redraw canvas when points, selection, or viewMode changes
  useEffect(() => {
    drawCanvas();
  }, [points, viewMode, isWarping]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const bgImg = backgroundImageRef.current;
    const texImg = textureImageRef.current;

    if (!canvas || !bgImg) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions based on container width while preserving image aspect ratio
    const container = containerRef.current;
    if (container) {
      const containerWidth = container.clientWidth;
      const aspect = bgImg.naturalHeight / bgImg.naturalWidth;
      canvas.width = containerWidth;
      canvas.height = containerWidth * aspect;
    }

    // 1. Draw base room image
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    // 2. Perform texture warp (if active and after view mode is selected)
    if (viewMode === 'after' && isWarping && texImg) {
      drawWarpedTexture(ctx, canvas.width, canvas.height, texImg);
    }

    // 3. Draw guiding wires and handles (only if viewMode is after)
    if (viewMode === 'after') {
      drawGuides(ctx, canvas.width, canvas.height);
    }
  };

  // 3. Triangulation-Based Projective Transform Math
  const drawWarpedTexture = (
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    texture: HTMLImageElement
  ) => {
    // Map normalized coordinates of handles to actual pixel coordinates
    const p0 = { x: points[0].x * canvasWidth, y: points[0].y * canvasHeight };
    const p1 = { x: points[1].x * canvasWidth, y: points[1].y * canvasHeight };
    const p2 = { x: points[2].x * canvasWidth, y: points[2].y * canvasHeight };
    const p3 = { x: points[3].x * canvasWidth, y: points[3].y * canvasHeight };

    // Offscreen canvas for rendering the texture before blending
    const offscreen = document.createElement('canvas');
    offscreen.width = canvasWidth;
    offscreen.height = canvasHeight;
    const octx = offscreen.getContext('2d');
    if (!octx) return;

    // Divide the texture into a grid of NxN cells (higher N = more precise perspective)
    const N = 16;
    
    // Helper: Bilinear interpolation to map normalized grid coordinates (u, v) to the screen quadrilateral
    const getDestPoint = (u: number, v: number) => {
      const x = (1 - u) * (1 - v) * p0.x + u * (1 - v) * p1.x + u * v * p2.x + (1 - u) * v * p3.x;
      const y = (1 - u) * (1 - v) * p0.y + u * (1 - v) * p1.y + u * v * p2.y + (1 - u) * v * p3.y;
      return { x, y };
    };

    // Loop through the grid cells
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        // Grid corners in normalized (0 to 1) space
        const u0 = i / N;
        const u1 = (i + 1) / N;
        const v0 = j / N;
        const v1 = (j + 1) / N;

        // Source coordinates on the texture (pixel values)
        const tx0 = u0 * texture.width;
        const tx1 = u1 * texture.width;
        const ty0 = v0 * texture.height;
        const ty1 = v1 * texture.height;

        // Destination coordinates on the screen
        const d00 = getDestPoint(u0, v0);
        const d10 = getDestPoint(u1, v0);
        const d11 = getDestPoint(u1, v1);
        const d01 = getDestPoint(u0, v1);

        // Grid cells are split into two triangles: A (TL, TR, BL) and B (TR, BR, BL)
        
        // Triangle A
        drawTriangleAffine(octx, texture, 
          tx0, ty0, tx1, ty0, tx0, ty1,
          d00.x, d00.y, d10.x, d10.y, d01.x, d01.y
        );

        // Triangle B
        drawTriangleAffine(octx, texture,
          tx1, ty0, tx1, ty1, tx0, ty1,
          d10.x, d10.y, d11.x, d11.y, d01.x, d01.y
        );
      }
    }

    // 4. Realism Pass: Layering the texture on top of the original shadows
    ctx.save();
    
    // Clip the drawing area to the exact floor boundary to prevent bleeding
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.clip();

    // Draw the warped texture first at 100% opacity
    ctx.globalAlpha = 1.0;
    ctx.drawImage(offscreen, 0, 0);

    // Apply the original shadows back on top using the Multiply blend mode
    // This overlay reads existing lighting details (furniture shadows, ambient gradients)
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = 0.35;
    ctx.drawImage(backgroundImageRef.current!, 0, 0, canvasWidth, canvasHeight);

    ctx.restore();
  };

  // Helper: Computes and draws a single affine triangle transform from texture to canvas
  const drawTriangleAffine = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x0: number, y0: number,
    x1: number, y1: number,
    x2: number, y2: number,
    u0: number, v0: number,
    u1: number, v1: number,
    u2: number, v2: number
  ) => {
    // Solve linear system equations for affine transformation matrix
    const denom = x0 * (y1 - y2) - y0 * (x1 - x2) + (x1 * y2 - x2 * y1);
    if (Math.abs(denom) < 0.0001) return;

    const a = (u0 * (y1 - y2) - y0 * (u1 - u2) + (u1 * y2 - u2 * y1)) / denom;
    const b = (v0 * (y1 - y2) - y0 * (v1 - v2) + (v1 * y2 - v2 * y1)) / denom;
    const c = (x0 * (u1 - u2) - u0 * (x1 - x2) + (x1 * u2 - x2 * u1)) / denom;
    const d = (x0 * (v1 - v2) - v0 * (x1 - x2) + (x1 * v2 - x2 * v1)) / denom;
    const e = (x0 * (y1 * u2 - y2 * u1) - y0 * (x1 * u2 - x2 * u1) + u0 * (x1 * y2 - x2 * y1)) / denom;
    const f = (x0 * (y1 * v2 - y2 * v1) - y0 * (x1 * v2 - x2 * v1) + v0 * (x1 * y2 - x2 * y1)) / denom;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(u0, v0);
    ctx.lineTo(u1, v1);
    ctx.lineTo(u2, v2);
    ctx.closePath();
    ctx.clip();

    ctx.transform(a, b, c, d, e, f);
    ctx.drawImage(img, 0, 0);
    ctx.restore();
  };

  // Draw wireframe borders and corner drag handles
  const drawGuides = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const p0 = { x: points[0].x * w, y: points[0].y * h };
    const p1 = { x: points[1].x * w, y: points[1].y * h };
    const p2 = { x: points[2].x * w, y: points[2].y * h };
    const p3 = { x: points[3].x * w, y: points[3].y * h };

    // 1. Draw boundary lines
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(212, 159, 26, 0.9)'; // Angel gold
    ctx.stroke();

    // Fill plane with a transparent overlay
    ctx.fillStyle = 'rgba(212, 159, 26, 0.05)';
    ctx.fill();

    // 2. Draw corner handles
    points.forEach((p, idx) => {
      const px = p.x * w;
      const py = p.y * h;

      ctx.beginPath();
      ctx.arc(px, py, idx === activePoint ? 14 : 9, 0, 2 * Math.PI);
      ctx.fillStyle = idx === activePoint ? '#ffffff' : '#d49f1a';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 6;
      ctx.fill();
      
      // Outline circle
      ctx.beginPath();
      ctx.arc(px, py, idx === activePoint ? 16 : 11, 0, 2 * Math.PI);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    });
  };

  // 4. Handle mouse/touch drag triggers
  const getMouseCoord = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    };
  };

  const handleStartDrag = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (viewMode === 'before') return;
    const coord = getMouseCoord(e);
    if (!coord) return;

    // Detect closest point within 30px (normalized threshold)
    const threshold = 0.04;
    let closestIdx: number | null = null;
    let minDist = Infinity;

    points.forEach((p, idx) => {
      const dist = Math.hypot(p.x - coord.x, p.y - coord.y);
      if (dist < threshold && dist < minDist) {
        minDist = dist;
        closestIdx = idx;
      }
    });

    if (closestIdx !== null) {
      setActivePoint(closestIdx);
    }
  };

  const handleDrag = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (activePoint === null) return;
    const coord = getMouseCoord(e);
    if (!coord) return;

    // Keep handles inside canvas boundaries
    const newX = Math.max(0.01, Math.min(0.99, coord.x));
    const newY = Math.max(0.01, Math.min(0.99, coord.y));

    setPoints(prev => {
      const next = [...prev];
      next[activePoint] = { x: newX, y: newY };
      return next;
    });
  };

  const handleEndDrag = () => {
    setActivePoint(null);
  };

  // 5. Custom image upload processing
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG or PNG).');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSelectedRoom(dataUrl);
      // Reset handles to default plane
      setPoints([
        { x: 0.25, y: 0.55 },
        { x: 0.75, y: 0.55 },
        { x: 0.85, y: 0.85 },
        { x: 0.15, y: 0.85 },
      ]);
    };
    reader.readAsDataURL(file);
  };

  // 6. Reset handles to default boundaries
  const handleResetPoints = () => {
    setPoints([
      { x: 0.2, y: 0.6 },
      { x: 0.8, y: 0.6 },
      { x: 0.9, y: 0.85 },
      { x: 0.1, y: 0.85 },
    ]);
  };

  // 7. Download composite output file
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Temporarily hide wireframes to download clean composite
    const tempPoints = [...points];
    const prevView = viewMode;
    
    // We render without handles, convert to url, then restore
    setViewMode('after');
    const bgImg = backgroundImageRef.current;
    const texImg = textureImageRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx && bgImg && texImg) {
      // Draw background
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
      // Draw texture
      drawWarpedTexture(ctx, canvas.width, canvas.height, texImg);
      
      // Save data URL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.download = `angel-tiles-visualize-${selectedProduct.slug}.jpg`;
      link.href = dataUrl;
      link.click();
      
      // Restore view
      drawCanvas();
    }
  };

  // WhatsApp EnquiryPrefill Message
  const waEnquiryUrl = () => {
    const msg = encodeURIComponent(
      `Hi Angel Tiles Jodhpur, I previewed the ${selectedProduct.name} slab inside your Room Visualizer and would like to get a pricing and stock quote.`
    );
    return `https://wa.me/919876543210?text=${msg}`;
  };

  return (
    <div className="relative min-h-screen bg-stone-950 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <div>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-xs text-stone-500 hover:text-white uppercase font-bold tracking-widest mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <h1 className="font-serif text-3xl md:text-5xl uppercase tracking-wide text-white">
              Room <span className="italic text-gold-foil">Visualizer</span>
            </h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'after' ? 'before' : 'after')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 border border-stone-800 text-xs font-bold uppercase tracking-wider rounded-lg text-white hover:bg-stone-850 transition-colors"
              data-cursor="view"
            >
              <Eye className="w-4 h-4 text-gold-400" />
              <span>{viewMode === 'after' ? 'Show Before' : 'Show After'}</span>
            </button>
            <button
              onClick={handleResetPoints}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900/50 border border-stone-900 text-xs font-bold uppercase tracking-wider rounded-lg text-stone-400 hover:text-white hover:bg-stone-900 transition-colors"
              title="Reset Handles"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visualizer Workspace grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Left/Center Column: Canvas Panel */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div 
              ref={containerRef}
              className="relative w-full rounded-xl overflow-hidden border border-stone-850 bg-stone-950 shadow-2xl select-none touch-none"
            >
              <canvas
                ref={canvasRef}
                className="block mx-auto cursor-pointer"
                onMouseDown={handleStartDrag}
                onMouseMove={handleDrag}
                onMouseUp={handleEndDrag}
                onMouseLeave={handleEndDrag}
                onTouchStart={handleStartDrag}
                onTouchMove={handleDrag}
                onTouchEnd={handleEndDrag}
              />
            </div>
            
            {/* Visualizer Instructions Banner */}
            <div className="p-4 bg-gold-400/5 border border-gold-400/10 rounded-lg text-xs leading-relaxed text-stone-400 flex gap-3">
              <Sparkles className="w-5 h-5 text-gold-400 shrink-0" />
              <div>
                <span className="font-bold text-white uppercase tracking-wider block mb-1">Perspective Guide</span>
                Drag the four gold circle handles to outline the borders of your floor or wall. Select any stone model below to warp it into place instantly.
              </div>
            </div>
          </div>

          {/* Right Column: Customizers Control Panel */}
          <div className="flex flex-col gap-8">
            
            {/* 1. Room selection options */}
            <div className="border border-stone-900 rounded-xl p-6 bg-stone-900/10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4 border-b border-stone-900 pb-3">
                1. Select Room Template
              </h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {PRESET_ROOMS.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room.url)}
                    className={`px-3 py-2 rounded text-[10px] font-bold uppercase tracking-wider border text-center transition-all ${
                      selectedRoom === room.url 
                        ? 'bg-gold-400 border-gold-400 text-stone-950' 
                        : 'bg-stone-900 border-stone-850 text-stone-400 hover:text-white'
                    }`}
                  >
                    {room.name}
                  </button>
                ))}
              </div>

              {/* Upload custom room photo */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center justify-center gap-2 px-4 py-3 bg-stone-900 border border-stone-800 border-dashed rounded-lg text-xs font-semibold uppercase tracking-wider text-stone-400 hover:text-white hover:border-stone-600 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-gold-400" />
                  <span>Upload Your Room Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {uploadError && (
                  <p className="text-[10px] text-red-500 font-medium">{uploadError}</p>
                )}
                <span className="text-[9px] text-stone-600 text-center leading-normal">
                  Uploaded photos are processed entirely inside your browser. No files are uploaded to any server.
                </span>
              </div>
            </div>

            {/* 2. Texture material selectors */}
            <div className="border border-stone-900 rounded-xl p-6 bg-stone-900/10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4 border-b border-stone-900 pb-3">
                2. Choose Stone Material
              </h3>
              
              <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-2">
                {PRODUCTS.map((prod) => (
                  <button
                    key={prod.slug}
                    onClick={() => setSelectedProduct(prod)}
                    className={`flex items-center gap-3 p-2 rounded-lg border text-left transition-all ${
                      selectedProduct.slug === prod.slug
                        ? 'border-gold-400 bg-gold-400/5'
                        : 'border-stone-900 hover:border-stone-800'
                    }`}
                  >
                    <div className="relative w-12 h-12 rounded overflow-hidden bg-stone-900 shrink-0 border border-stone-800">
                      <Image 
                        src={prod.texture} 
                        alt={prod.name} 
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest block">
                        {prod.category}
                      </span>
                      <span className="text-xs text-white font-medium block truncate mt-0.5">
                        {prod.name}
                      </span>
                      <span className="text-[10px] text-gold-400 font-bold block mt-0.5">
                        {prod.priceRange}
                      </span>
                    </div>
                    {selectedProduct.slug === prod.slug && (
                      <div className="w-5 h-5 rounded-full bg-gold-400 flex items-center justify-center text-stone-950">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Output Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDownload}
                className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-stone-900 border border-stone-800 text-white hover:bg-stone-850 hover:border-stone-700 transition-colors font-bold text-xs uppercase tracking-widest rounded-full"
                data-cursor="save"
              >
                <Download className="w-4 h-4 text-gold-400" />
                <span>Download Preview</span>
              </button>
              
              <a
                href={waEnquiryUrl()}
                className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 font-bold text-xs uppercase tracking-widest rounded-full transition-transform hover:scale-105 shadow-lg shadow-gold-500/20"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="chat"
              >
                <Phone className="w-4 h-4" />
                <span>Enquire about this style</span>
              </a>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

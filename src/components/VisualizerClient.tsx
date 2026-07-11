'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, Upload, Download, ArrowLeft, RotateCcw, Check, Phone, Eye, 
  MessageSquare, Sliders, Calculator, Calendar, Send, X, ChevronRight, HelpCircle 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PRODUCTS, Product } from '@/content/products';

interface Point {
  x: number;
  y: number;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
  products?: Product[];
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
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Core Visualizer States
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

  // 1. Slab Selection Live Inventory States
  const [selectedLot, setSelectedLot] = useState('lot-1');
  const [lotOffset, setLotOffset] = useState(0);

  // 2. Comparison Mode States
  const [compareMode, setCompareMode] = useState(false);
  const [compareProduct, setCompareProduct] = useState<Product>(PRODUCTS[1]);
  const [splitX, setSplitX] = useState(0.5);
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);

  // 3. Quote Generator States
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteArea, setQuoteArea] = useState(1200);
  const [quoteApp, setQuoteApp] = useState('Flooring');
  const [quoteWastage, setQuoteWastage] = useState(10);
  const [quoteClientLocation, setQuoteClientLocation] = useState('Jodhpur, Rajasthan');

  // 4. AI Consultant States
  const [isConsultantOpen, setIsConsultantOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Hello! I am your Angel Stone Consultant. Tell me about your room project (e.g. 'luxury lobby flooring', 'sturdy kitchen granite countertops', or 'budget-friendly tile cladding') and I'll match-recommend the perfect slab selections from our Jodhpur showroom."
    }
  ]);

  // Assets refs
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);
  const textureImageRef = useRef<HTMLImageElement | null>(null);
  const compareTextureImageRef = useRef<HTMLImageElement | null>(null);

  // Load background image, main texture, and comparison texture
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

    const compareTexImg = new window.Image();
    compareTexImg.src = compareProduct.texture;
    compareTexImg.crossOrigin = 'anonymous';
    compareTexImg.onload = () => {
      compareTextureImageRef.current = compareTexImg;
      drawCanvas();
    };
  }, [selectedRoom, selectedProduct, compareProduct]);

  // Redraw canvas when points, selection, or viewMode changes
  useEffect(() => {
    drawCanvas();
  }, [points, viewMode, isWarping, compareMode, splitX, lotOffset]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

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
      if (compareMode && compareTextureImageRef.current) {
        // Draw Left Split (Product A with lotOffset)
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width * splitX, canvas.height);
        ctx.clip();
        drawWarpedTexture(ctx, canvas.width, canvas.height, texImg, lotOffset);
        ctx.restore();

        // Draw Right Split (Product B without lotOffset/default)
        ctx.save();
        ctx.beginPath();
        ctx.rect(canvas.width * splitX, 0, canvas.width * (1 - splitX), canvas.height);
        ctx.clip();
        drawWarpedTexture(ctx, canvas.width, canvas.height, compareTextureImageRef.current, 0);
        ctx.restore();
      } else {
        drawWarpedTexture(ctx, canvas.width, canvas.height, texImg, lotOffset);
      }
    }

    // 3. Draw guiding wires and handles (only if viewMode is after)
    if (viewMode === 'after') {
      drawGuides(ctx, canvas.width, canvas.height);
    }

    // 4. Draw Compare split slider divider line
    if (viewMode === 'after' && compareMode) {
      const sx = splitX * canvas.width;
      
      // Vertical line
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, canvas.height);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 6;
      ctx.stroke();
      ctx.shadowBlur = 0; // reset
      
      // Handle Circle
      ctx.beginPath();
      ctx.arc(sx, canvas.height / 2, 20, 0, 2 * Math.PI);
      ctx.fillStyle = '#d49f1a';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Left-Right arrows text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('◀  ▶', sx, canvas.height / 2);
    }
  };

  // Triangulation-Based Projective Transform Math
  const drawWarpedTexture = (
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    texture: HTMLImageElement,
    offset: number
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
    
    // Shift source coordinates by offset percentage to simulate batch selections
    const shiftX = (offset / 300) * texture.width;
    const shiftY = (offset / 300) * texture.height;
    
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
        // Crop scale factor (0.7) prevents shifting beyond borders
        const tx0 = u0 * (texture.width * 0.7) + shiftX;
        const tx1 = u1 * (texture.width * 0.7) + shiftX;
        const ty0 = v0 * (texture.height * 0.7) + shiftY;
        const ty1 = v1 * (texture.height * 0.7) + shiftY;

        // Destination coordinates on the screen
        const d00 = getDestPoint(u0, v0);
        const d10 = getDestPoint(u1, v0);
        const d11 = getDestPoint(u1, v1);
        const d01 = getDestPoint(u0, v1);

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

    // Realism Pass: Layering the texture on top of the original shadows
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

    ctx.fillStyle = 'rgba(212, 159, 26, 0.04)';
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

  // Handle mouse/touch drag triggers
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

    // Check if clicking near the vertical split divider in comparison mode
    if (compareMode) {
      const thresholdX = 0.035;
      if (Math.abs(coord.x - splitX) < thresholdX) {
        setIsDraggingSplit(true);
        return;
      }
    }

    // Detect closest corner point handle
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
    const coord = getMouseCoord(e);
    if (!coord) return;

    if (isDraggingSplit) {
      setSplitX(Math.max(0.02, Math.min(0.98, coord.x)));
      return;
    }

    if (activePoint === null) return;

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
    setIsDraggingSplit(false);
  };

  // Custom image upload processing
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

  // Reset handles to default boundaries
  const handleResetPoints = () => {
    setPoints([
      { x: 0.2, y: 0.6 },
      { x: 0.8, y: 0.6 },
      { x: 0.9, y: 0.85 },
      { x: 0.1, y: 0.85 },
    ]);
  };

  // Download composite output file
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Temporarily draw without handles to download clean composite
    const prevView = viewMode;
    setViewMode('after');
    const bgImg = backgroundImageRef.current;
    const texImg = textureImageRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx && bgImg && texImg) {
      // Draw base
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
      // Draw textures
      if (compareMode && compareTextureImageRef.current) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width * splitX, canvas.height);
        ctx.clip();
        drawWarpedTexture(ctx, canvas.width, canvas.height, texImg, lotOffset);
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.rect(canvas.width * splitX, 0, canvas.width * (1 - splitX), canvas.height);
        ctx.clip();
        drawWarpedTexture(ctx, canvas.width, canvas.height, compareTextureImageRef.current, 0);
        ctx.restore();
      } else {
        drawWarpedTexture(ctx, canvas.width, canvas.height, texImg, lotOffset);
      }
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.download = `angel-tiles-visualize-${selectedProduct.slug}.jpg`;
      link.href = dataUrl;
      link.click();
      
      // Restore wireframe view
      drawCanvas();
    }
  };

  // Sourcing Estimate Calculations
  const calculateEstimateRange = (product: Product) => {
    // Parse priceRange e.g., "₹250 - ₹800 per sq ft" or "₹8,500 - ₹22,000 per unit"
    const numbers = product.priceRange.replace(/[^0-9-]/g, '').split('-');
    const min = parseInt(numbers[0] || '100', 10);
    const max = parseInt(numbers[1] || '500', 10);

    const totalAreaNeeded = quoteArea * (1 + quoteWastage / 100);
    const subtotalMin = totalAreaNeeded * min;
    const subtotalMax = totalAreaNeeded * max;

    // GST (18%)
    const gstMin = subtotalMin * 0.18;
    const gstMax = subtotalMax * 0.18;

    // Fixed Loading + Handling
    const handling = 4500;

    return {
      min,
      max,
      totalAreaNeeded,
      subtotalMin,
      subtotalMax,
      gstMin,
      gstMax,
      handling,
      totalMin: subtotalMin + gstMin + handling,
      totalMax: subtotalMax + gstMax + handling,
    };
  };

  // Prefilled WhatsApp Enquiry Message (Standard Sourcing Request)
  const waEnquiryUrl = () => {
    const msg = encodeURIComponent(
      `Hi Angel Tiles Jodhpur, I previewed the ${selectedProduct.name} slab (Active Lot: ${selectedLot.toUpperCase()}) inside your Room Visualizer and would like to coordinate a quote request.`
    );
    return `https://wa.me/918147941542?text=${msg}`;
  };

  // Sourcing Quote WhatsApp message
  const waQuoteUrl = () => {
    const calc = calculateEstimateRange(selectedProduct);
    const rangeText = selectedProduct.category === 'sanitaryware' ? 'units' : 'sq ft';
    const msg = encodeURIComponent(
      `Hi Angel Tiles & Stone Jodhpur, I generated an estimate for my space:\n\n` +
      `💎 Material: ${selectedProduct.name}\n` +
      `📦 Slab Lot/Pattern: ${selectedLot.toUpperCase()}\n` +
      `📐 Area Needed: ${quoteArea} ${rangeText} (+${quoteWastage}% wastage: ${calc.totalAreaNeeded.toFixed(0)} ${rangeText})\n` +
      `📍 Site Location: ${quoteClientLocation}\n` +
      `💼 Estimated Price Range: ₹${calc.totalMin.toLocaleString('en-IN')} - ₹${calc.totalMax.toLocaleString('en-IN')}\n\n` +
      `Please confirm material availability and coordinate delivery.`
    );
    return `https://wa.me/918147941542?text=${msg}`;
  };

  // AI Consultant message sender
  const handleConsultantSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let responseText = "";
      let matchedProds: Product[] = [];

      if (lower.includes('kitchen') || lower.includes('countertop') || lower.includes('island')) {
        responseText = "For kitchen countertops and islands, I highly recommend our high-density Brazil/Rajasthan granites. They are non-porous (stain repellent) and offer extreme heat resistance. Take a look at these materials:";
        matchedProds = PRODUCTS.filter(p => p.category === 'granite');
      } else if (lower.includes('bathroom') || lower.includes('bath') || lower.includes('wash') || lower.includes('toilet') || lower.includes('basin')) {
        responseText = "For luxury bathrooms and powder rooms, combining tabletop basins and rimless closets with high-definition PGVT marble-look wall tiles creates a cohesive boutique feel. Here are my recommendations:";
        matchedProds = PRODUCTS.filter(p => p.category === 'sanitaryware' || p.slug === 'polished-glazed-vitrified-tiles');
      } else if (lower.includes('living') || lower.includes('floor') || lower.includes('lobby') || lower.includes('hall') || lower.includes('marble')) {
        responseText = "For luxury living rooms, our bookmatched Carrara and Statuario imports represent the premium tier. For authentic Indian heritage, original Makrana White Marble cannot be beaten. Explore these flooring choices:";
        matchedProds = PRODUCTS.filter(p => p.category === 'marble' || p.slug === 'polished-glazed-vitrified-tiles');
      } else if (lower.includes('budget') || lower.includes('cheap') || lower.includes('price') || lower.includes('under')) {
        responseText = "If you want an elite look at a highly competitive rate, our vitrified floor tiles are exceptional options. Sourced from Morbi, Gujarat, they require zero resealing. Take a look at these options:";
        matchedProds = PRODUCTS.filter(p => p.slug === 'polished-glazed-vitrified-tiles' || p.slug === 'double-charge-vitrified-tiles' || p.slug === 'jodhpur-red-granite');
      } else if (lower.includes('white') || lower.includes('light')) {
        responseText = "To achieve an open, highly-reflective visual aesthetic, these white marbles and frosty white granites are ideal:";
        matchedProds = PRODUCTS.filter(p => p.slug === 'makrana-white-marble' || p.slug === 'italian-statuario-marble' || p.slug === 'alaska-white-granite' || p.slug === 'carrara-white-marble');
      } else if (lower.includes('black') || lower.includes('dark')) {
        responseText = "Dark materials offer rich textures. Our Rajasthan Black Granite is a dense, high-compressive stone that delivers a sleek mirror-like finish:";
        matchedProds = PRODUCTS.filter(p => p.slug === 'rajasthan-black-granite');
      } else {
        responseText = "That sounds like a beautiful project! Sourcing matching runs is crucial for a unified look. Based on your description, here are some versatile, premium stone slabs from our active Shankar Nagar yard:";
        matchedProds = PRODUCTS.slice(0, 3);
      }

      const aiMsg: Message = {
        sender: 'ai',
        text: responseText,
        products: matchedProds
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1100);
  };

  const calcResult = calculateEstimateRange(selectedProduct);

  return (
    <div className="relative min-h-screen bg-stone-950 flex flex-col justify-between overflow-x-hidden">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        {/* Breadcrumb Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
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

          <div className="flex flex-wrap gap-2">
            {/* AI Consultant Button */}
            <button
              onClick={() => setIsConsultantOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gold-400/10 border border-gold-400/30 text-xs font-bold uppercase tracking-wider rounded-lg text-gold-400 hover:bg-gold-400 hover:text-stone-950 transition-all shadow-md shadow-gold-500/5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>AI Consultant</span>
            </button>

            {/* Split Screen Comparison Button */}
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 border text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
                compareMode 
                  ? 'bg-gold-400/20 border-gold-400 text-gold-400' 
                  : 'bg-stone-900 border-stone-850 text-stone-400 hover:text-white hover:bg-stone-850'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>{compareMode ? 'Disable Comparison' : 'Compare Split'}</span>
            </button>

            {/* Before/After Toggle */}
            <button
              onClick={() => setViewMode(viewMode === 'after' ? 'before' : 'after')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 border border-stone-800 text-xs font-bold uppercase tracking-wider rounded-lg text-white hover:bg-stone-850 transition-colors"
              data-cursor="view"
            >
              <Eye className="w-4 h-4 text-gold-400" />
              <span>{viewMode === 'after' ? 'Show Before' : 'Show After'}</span>
            </button>

            {/* Reset handles */}
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
                <span className="font-bold text-white uppercase tracking-wider block mb-1">Perspective Guide & Split comparison</span>
                {compareMode ? (
                  <span>Drag the vertical white slider on the canvas to compare materials. Adjust the four gold corner handles to warp textures dynamically.</span>
                ) : (
                  <span>Drag the four gold circle handles to outline the boundaries of your floor or wall. Select any stone material on the right to warp it in.</span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Customizers Control Panel */}
          <div className="flex flex-col gap-6">
            
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
              </div>
            </div>

            {/* 2. Main Material Selection */}
            <div className="border border-stone-900 rounded-xl p-6 bg-stone-900/10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4 border-b border-stone-900 pb-3">
                {compareMode ? '2. Select Material A (Left Side)' : '2. Choose Stone Material'}
              </h3>
              
              <div className="flex flex-col gap-2.5 max-h-[190px] overflow-y-auto pr-2">
                {PRODUCTS.map((prod) => (
                  <button
                    key={prod.slug}
                    onClick={() => setSelectedProduct(prod)}
                    className={`flex items-center gap-3 p-2 rounded-lg border text-left transition-all ${
                      selectedProduct.slug === prod.slug
                        ? 'border-gold-400 bg-gold-400/5'
                        : 'border-stone-900 hover:border-stone-850'
                    }`}
                  >
                    <div className="relative w-10 h-10 rounded overflow-hidden bg-stone-900 shrink-0 border border-stone-800">
                      <Image 
                        src={prod.texture} 
                        alt={prod.name} 
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-white font-medium block truncate">
                        {prod.name}
                      </span>
                      <span className="text-[9px] text-stone-500 font-bold uppercase block mt-0.5">
                        {prod.priceRange}
                      </span>
                    </div>
                    {selectedProduct.slug === prod.slug && (
                      <div className="w-4 h-4 rounded-full bg-gold-400 flex items-center justify-center text-stone-950">
                        <Check className="w-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Lot Sourcing Inventory Selector */}
              <div className="mt-4 pt-4 border-t border-stone-900/60">
                <span className="text-[9px] text-stone-500 uppercase tracking-widest font-bold block mb-2.5">
                  Select Active Quarry Slab Lot
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'lot-1', label: 'Lot B-01', details: '12 Slabs', offset: 0 },
                    { id: 'lot-2', label: 'Lot B-02', details: '8 Slabs', offset: 60 },
                    { id: 'lot-3', label: 'Lot B-03', details: '16 Slabs', offset: 120 },
                  ].map((lot) => (
                    <button
                      key={lot.id}
                      onClick={() => {
                        setSelectedLot(lot.id);
                        setLotOffset(lot.offset);
                      }}
                      className={`flex flex-col p-2 border rounded text-center transition-all ${
                        selectedLot === lot.id
                          ? 'bg-gold-400 border-gold-400 text-stone-950 font-bold'
                          : 'bg-stone-950 border-stone-850 text-stone-400 hover:border-stone-800'
                      }`}
                    >
                      <span className="text-[9px] uppercase tracking-wider block">{lot.label}</span>
                      <span className={`text-[8px] mt-0.5 ${selectedLot === lot.id ? 'text-stone-900/80' : 'text-stone-500'}`}>{lot.details}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Compare Material Selection (Only visible if compareMode is active) */}
            {compareMode && (
              <div className="border border-gold-500/20 rounded-xl p-6 bg-stone-900/10 animate-in slide-in-from-top duration-300">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gold-400 mb-4 border-b border-stone-900 pb-3">
                  3. Select Material B (Right Side)
                </h3>
                
                <div className="flex flex-col gap-2.5 max-h-[190px] overflow-y-auto pr-2">
                  {PRODUCTS.map((prod) => (
                    <button
                      key={`compare-${prod.slug}`}
                      onClick={() => setCompareProduct(prod)}
                      className={`flex items-center gap-3 p-2 rounded-lg border text-left transition-all ${
                        compareProduct.slug === prod.slug
                          ? 'border-gold-400 bg-gold-400/5'
                          : 'border-stone-900 hover:border-stone-850'
                      }`}
                    >
                      <div className="relative w-10 h-10 rounded overflow-hidden bg-stone-900 shrink-0 border border-stone-800">
                        <Image 
                          src={prod.texture} 
                          alt={prod.name} 
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-white font-medium block truncate">
                          {prod.name}
                        </span>
                        <span className="text-[9px] text-stone-500 font-bold uppercase block mt-0.5">
                          {prod.priceRange}
                        </span>
                      </div>
                      {compareProduct.slug === prod.slug && (
                        <div className="w-4 h-4 rounded-full bg-gold-400 flex items-center justify-center text-stone-950">
                          <Check className="w-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Output Actions */}
            <div className="flex flex-col gap-2.5">
              {/* Sourcing Estimate Button */}
              <button
                onClick={() => setIsQuoteModalOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-gold-400/10 border border-gold-400/30 text-gold-400 hover:bg-gold-400 hover:text-stone-950 transition-all font-bold text-xs uppercase tracking-widest rounded-full"
              >
                <Calculator className="w-4 h-4" />
                <span>Calculate Sourcing Estimate</span>
              </button>

              <button
                onClick={handleDownload}
                className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-stone-900 border border-stone-850 text-white hover:bg-stone-850 hover:border-stone-750 transition-colors font-bold text-xs uppercase tracking-widest rounded-full"
                data-cursor="save"
              >
                <Download className="w-4 h-4 text-gold-400" />
                <span>Download Slabs Preview</span>
              </button>
              
              <a
                href={waEnquiryUrl()}
                className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 font-bold text-xs uppercase tracking-widest rounded-full transition-transform hover:scale-105 shadow-lg shadow-gold-500/20"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="chat"
              >
                <Phone className="w-4 h-4" />
                <span>Enquire Slabs Lot WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      </main>

      {/* -------------------- Modals & Drawers -------------------- */}

      {/* A. Sourcing Quote Estimate Calculator Modal */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto text-stone-300 font-sans text-xs flex flex-col gap-6 animate-in zoom-in-95 duration-250">
            <button 
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute top-4 right-4 text-stone-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-gold-400 text-[10px] font-bold uppercase tracking-[0.2em] block mb-1">Costing Estimator</span>
              <h3 className="font-serif text-2xl text-white uppercase tracking-wider">
                Sourcing Quote Summary
              </h3>
            </div>

            {/* Inputs Block */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-stone-950 rounded-xl border border-stone-850">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-white uppercase tracking-wider text-[10px]">Project Area (Sq Ft)</label>
                <input
                  type="number"
                  value={quoteArea}
                  onChange={(e) => setQuoteArea(Math.max(1, parseInt(e.target.value) || 0))}
                  className="bg-stone-900 border border-stone-800 rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-white uppercase tracking-wider text-[10px]">Wastage Allowance</label>
                <select
                  value={quoteWastage}
                  onChange={(e) => setQuoteWastage(parseInt(e.target.value))}
                  className="bg-stone-900 border border-stone-800 rounded px-3 py-2 text-white focus:outline-none focus:border-gold-400 cursor-pointer"
                >
                  <option value="5">5% (Simple cuts)</option>
                  <option value="10">10% (Diagonal laying)</option>
                  <option value="15">15% (Bookmatch grids)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-white uppercase tracking-wider text-[10px]">Delivery Location</label>
                <input
                  type="text"
                  value={quoteClientLocation}
                  onChange={(e) => setQuoteClientLocation(e.target.value)}
                  className="bg-stone-900 border border-stone-800 rounded px-3 py-2 text-white focus:outline-none focus:border-gold-400"
                  placeholder="e.g. Shankar Nagar Jodhpur"
                />
              </div>
            </div>

            {/* Receipt Invoice Sheet */}
            <div className="border border-stone-800 rounded-xl p-6 bg-stone-950 font-mono text-[11px] leading-relaxed relative overflow-hidden">
              {/* Invoice Crest watermark */}
              <div className="absolute top-4 right-4 text-[9px] uppercase tracking-widest text-stone-800 font-bold border border-stone-850 px-2 py-0.5">
                Estimator Draft
              </div>

              <div className="border-b border-dashed border-stone-850 pb-4 mb-4">
                <h4 className="font-serif text-sm text-white uppercase tracking-widest font-bold">ANGEL STONE STUDIO JODHPUR</h4>
                <p className="text-[10px] text-stone-600 uppercase tracking-wider mt-1">Custom Material & Slab Estimate</p>
              </div>

              <div className="space-y-2 mb-4 text-stone-400 border-b border-dashed border-stone-850 pb-4">
                <div className="flex justify-between">
                  <span>Product Model:</span>
                  <span className="text-white font-bold uppercase">{selectedProduct.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lot / Slab Selection:</span>
                  <span className="text-white font-bold uppercase">{selectedLot.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Project Area:</span>
                  <span className="text-white">{quoteArea.toLocaleString()} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span>Material Price Rate:</span>
                  <span className="text-gold-400 font-bold">{selectedProduct.priceRange}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Material (incl. {quoteWastage}% wastage):</span>
                  <span className="text-white">{calcResult.totalAreaNeeded.toFixed(0)} sq ft</span>
                </div>
              </div>

              <div className="space-y-2.5 font-semibold text-stone-300">
                <div className="flex justify-between">
                  <span>Estimated Slabs Cost:</span>
                  <span>₹{calcResult.subtotalMin.toLocaleString('en-IN')} - ₹{calcResult.subtotalMax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-stone-500 font-normal">
                  <span>GST Surcharge (18%):</span>
                  <span>₹{calcResult.gstMin.toLocaleString('en-IN')} - ₹{calcResult.gstMax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-stone-500 font-normal">
                  <span>Loading & Yard Handling flat fee:</span>
                  <span>₹{calcResult.handling.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base font-serif text-gold-400 pt-3 border-t border-double border-stone-800">
                  <span>TOTAL ESTIMATED PRICE (RETAIL & SOURCING):</span>
                  <span className="font-bold">₹{calcResult.totalMin.toLocaleString('en-IN')} - ₹{calcResult.totalMax.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button 
                onClick={() => window.print()}
                className="flex-1 px-6 py-3 border border-stone-800 hover:border-white transition-colors text-white font-bold text-xs uppercase tracking-widest rounded-full"
              >
                Print Project Estimate
              </button>
              
              <a
                href={waQuoteUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 font-bold text-xs uppercase tracking-widest rounded-full transition-transform hover:scale-105 shadow-lg shadow-gold-500/20"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Confirm & Send on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* B. AI Design Consultant Drawer (Slide-in Panel from Right) */}
      <AnimatePresence>
        {isConsultantOpen && (
          <>
            {/* Drawer Backdrop Overlay */}
            <div 
              onClick={() => setIsConsultantOpen(false)}
              className="fixed inset-0 z-40 bg-stone-950/60 backdrop-blur-sm"
            />

            {/* Drawer content panel */}
            <div 
              className="fixed right-0 top-0 bottom-0 z-50 w-full md:w-[450px] bg-stone-900/95 backdrop-blur-xl border-l border-stone-800 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300"
            >
              {/* Header */}
              <div className="p-5 border-b border-stone-850 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-gold-500 animate-pulse" />
                  <div>
                    <h3 className="font-serif text-sm text-white uppercase tracking-wider font-bold">AI Design Consultant</h3>
                    <span className="text-[9px] text-stone-500 font-semibold block uppercase">Studio Sourcing Assistant</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsConsultantOpen(false)}
                  className="text-stone-500 hover:text-white transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
                {messages.map((msg, index) => (
                  <div 
                    key={index}
                    className={`flex flex-col gap-2 max-w-[85%] ${
                      msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <div 
                      className={`p-4 rounded-2xl leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 font-semibold rounded-tr-none'
                          : 'bg-stone-950 border border-stone-850 text-stone-300 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Matched product recommendation cards */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="flex flex-col gap-2 w-full mt-2">
                        {msg.products.map(p => (
                          <div 
                            key={p.slug}
                            className="bg-stone-950/80 border border-stone-850 rounded-xl p-3 flex items-center gap-3"
                          >
                            <div className="relative w-12 h-12 bg-stone-900 rounded overflow-hidden border border-stone-800">
                              <Image 
                                src={p.texture} 
                                alt={p.name} 
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] text-white font-bold block truncate">{p.name}</span>
                              <span className="text-[9px] text-gold-400 font-bold block mt-0.5">{p.priceRange}</span>
                              <div className="flex gap-2 mt-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedProduct(p);
                                    drawCanvas();
                                  }}
                                  className="text-[9px] text-stone-400 hover:text-white transition-colors uppercase font-bold"
                                >
                                  Apply Material
                                </button>
                                <span className="text-stone-700 text-[9px]">•</span>
                                <a
                                  href={`https://wa.me/918147941542?text=Hi%20Angel%20Tiles%20Jodhpur,%20I%20am%20enquiring%20about%20the%20${encodeURIComponent(p.name)}%20lot%20recommended%20by%20AI%20consultant.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[9px] text-gold-400 hover:text-white transition-colors uppercase font-bold"
                                >
                                  Enquire
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-1.5 text-stone-500 mr-auto ml-1">
                    <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>

              {/* Bottom input area */}
              <div className="p-4 border-t border-stone-850 bg-stone-950 flex flex-col gap-3">
                {/* Suggestions tags */}
                <div className="flex flex-wrap gap-2">
                  {[
                    "Statuario for Living Room",
                    "Kitchen Countertop Slabs",
                    "Matte Bathroom Basin combo",
                    "Best options under ₹300",
                  ].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleConsultantSend(tag)}
                      className="px-2.5 py-1.5 bg-stone-900 border border-stone-800 hover:border-gold-400 hover:text-white rounded-full text-[9px] font-medium tracking-wider text-stone-400 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleConsultantSend(inputMessage)}
                    placeholder="Describe your space requirements..."
                    className="flex-1 bg-stone-900 border border-stone-800 rounded-full px-4 py-2.5 text-white focus:outline-none focus:border-gold-400 text-xs"
                  />
                  <button
                    onClick={() => handleConsultantSend(inputMessage)}
                    className="p-2.5 bg-gold-400 hover:bg-gold-500 text-stone-950 rounded-full flex items-center justify-center active:scale-95 transition-transform shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

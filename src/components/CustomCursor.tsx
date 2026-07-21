'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ringPosition, setRingPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const idleRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const mouseActiveRef = useRef(true);

  useEffect(() => {
    // Hide cursor on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      mouseActiveRef.current = true;
      clearTimeout(idleRef.current);
      idleRef.current = setTimeout(() => { mouseActiveRef.current = false; }, 2000);
    };

    window.addEventListener('mousemove', onMouseMove);

    // Hover state handlers
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if target or parent is a link/button/clickable card
      const clickable = target.closest('a, button, [role="button"], [data-cursor]');
      if (clickable) {
        setIsHovered(true);
        const customText = clickable.getAttribute('data-cursor');
        if (customText) {
          setCursorText(customText);
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickable = target.closest('a, button, [role="button"], [data-cursor]');
      if (clickable) {
        setIsHovered(false);
        setCursorText('');
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      clearTimeout(idleRef.current);
    };
  }, []);

  // Smooth lerp effect for the outer ring
  useEffect(() => {
    if (!isVisible) return;
    
    let reqId: number;
    
    const updateRing = () => {
      if (!mouseActiveRef.current) {
        reqId = requestAnimationFrame(updateRing);
        return;
      }
      setRingPosition((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15,
        };
      });
      reqId = requestAnimationFrame(updateRing);
    };
    
    reqId = requestAnimationFrame(updateRing);
    return () => cancelAnimationFrame(reqId);
  }, [position, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Inner Dot */}
      <div
        className="custom-cursor"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isHovered ? '4px' : '8px',
          height: isHovered ? '4px' : '8px',
          backgroundColor: isHovered ? '#ffffff' : '#96222f',
        }}
      />
      
      {/* Outer Ring */}
      <div
        className="custom-cursor-ring flex items-center justify-center overflow-hidden"
        style={{
          left: `${ringPosition.x}px`,
          top: `${ringPosition.y}px`,
          width: isHovered ? (cursorText ? '80px' : '56px') : '40px',
          height: isHovered ? (cursorText ? '80px' : '56px') : '40px',
          borderColor: isHovered ? 'rgba(255, 255, 255, 0.8)' : 'rgba(150, 34, 47, 0.4)',
          backgroundColor: isHovered ? 'rgba(150, 34, 47, 0.15)' : 'transparent',
        }}
      >
        {cursorText && (
          <span className="text-[10px] uppercase font-bold tracking-wider text-white">
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
}

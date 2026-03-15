import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveDot = gsap.quickTo(dotRef.current, "x", { duration: 0.001 });
    const moveDotY = gsap.quickTo(dotRef.current, "y", { duration: 0.001 });
    const moveRing = gsap.quickTo(ringRef.current, "x", { duration: 0.2, ease: "power3" });
    const moveRingY = gsap.quickTo(ringRef.current, "y", { duration: 0.2, ease: "power3" });

    const handleMouseMove = (e: MouseEvent) => {
      moveDot(e.clientX);
      moveDotY(e.clientY);
      moveRing(e.clientX);
      moveRingY(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a') || target.classList.contains('interactive')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  useEffect(() => {
    if (isHovering) {
      gsap.to(ringRef.current, { scale: 3, opacity: 0.15, backgroundColor: '#FF5500', duration: 0.3 });
      gsap.to(dotRef.current, { scale: 0.5, backgroundColor: 'transparent', duration: 0.3 });
    } else {
      gsap.to(ringRef.current, { scale: 1, opacity: 0.5, backgroundColor: 'white', duration: 0.3 });
      gsap.to(dotRef.current, { scale: 1, backgroundColor: 'white', duration: 0.3 });
    }
  }, [isHovering]);

  return (
    <>
      <style>{`body, a, button { cursor: none !important; }`}</style>
      <div ref={dotRef} className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2 will-change-transform" />
      <div ref={ringRef} className="fixed top-0 left-0 w-8 h-8 border border-white rounded-full pointer-events-none z-[9998] mix-blend-difference -translate-x-1/2 -translate-y-1/2 will-change-transform" />
    </>
  );
};

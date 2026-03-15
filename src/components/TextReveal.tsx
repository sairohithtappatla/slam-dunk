import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface TextRevealProps {
  text: string;
  delay?: number;
}

export const TextReveal: React.FC<TextRevealProps> = ({ text, delay = 0 }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const chars = containerRef.current.querySelectorAll('.char');
    
    gsap.killTweensOf(chars);
    gsap.fromTo(chars, 
      { y: 100, opacity: 0, scale: 0.5, filter: 'blur(20px)', rotateX: -90 },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1, 
        filter: 'blur(0px)', 
        rotateX: 0, 
        duration: 1.2, 
        stagger: 0.05, 
        ease: "expo.out", 
        delay 
      }
    );
  }, [text, delay]);

  return (
    <span ref={containerRef} className="inline-flex relative" style={{ perspective: '1000px' }}>
      {text.split('').map((char, i) => (
        <span 
          key={`${text}-${i}`} 
          className="char inline-block will-change-transform origin-bottom"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {char}
        </span>
      ))}
    </span>
  );
};

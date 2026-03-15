import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Product } from '../types';
import { TextReveal } from './TextReveal';
import { Navbar } from './Navbar';
import { audioService } from '../services/audioService';

interface OverlayProps {
  product: Product;
  onNext: () => void;
  onPrev: () => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  cartCount: number;
  onAddToCart: () => void;
  onCustomize: () => void;
  onOpenCart: () => void;
}

export const Overlay: React.FC<OverlayProps> = ({ 
  product, onNext, onPrev, scrollRef, cartCount, onAddToCart, onCustomize, onOpenCart 
}) => {
  const priceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priceRef.current) {
      gsap.fromTo(priceRef.current, 
        { y: 30, opacity: 0, filter: 'blur(8px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: "power2.out", delay: 0.4 }
      );
    }
  }, [product.id]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
        else entry.target.classList.remove('in-view');
      });
    }, { threshold: 0.3 });

    if (scrollRef.current) {
      scrollRef.current.querySelectorAll('.animate-item').forEach(el => observer.observe(el));
    }
    return () => observer.disconnect();
  }, [product]);

  return (
    <div 
      ref={scrollRef} 
      className="absolute inset-0 z-30 w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth no-scrollbar snap-y snap-mandatory"
    >
      {/* Section 1: Hero */}
      <div className="relative w-full h-full min-h-full flex flex-col md:block snap-start">
        <div className="absolute top-0 left-0 w-full z-50">
          <Navbar cartCount={cartCount} onCustomize={onCustomize} onOpenCart={onOpenCart} />
        </div>

        {/* Background Title */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-start justify-center pt-[48vh] md:items-center md:pt-0">
          <h1 className="font-anton font-bold text-[16vw] md:text-[18vw] leading-none text-white tracking-widest mix-blend-overlay flex flex-row items-center gap-3 md:gap-[12vw]">
            <TextReveal text={product.namePart1} delay={0} />
            <TextReveal text={product.namePart2} delay={0.2} />
          </h1>
        </div>

        <div className="relative w-full h-full pointer-events-none flex flex-col justify-end z-10">
          <div className="md:hidden w-full h-[20vh] shrink-0" />
          
          {/* Promotion Video Button */}
          <div 
            className="hidden md:flex absolute left-[10%] top-[20%] items-center gap-4 pointer-events-auto cursor-pointer group hover:scale-105 transition-transform duration-300 interactive"
            onMouseEnter={() => audioService.playHover()}
            onClick={() => audioService.playClick()}
          >
            <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white/10 transition-all backdrop-blur-sm">
              <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
            </div>
            <div className="text-white text-xs font-light leading-tight opacity-70 group-hover:opacity-100 transition-opacity">
              Promotion<br />video
            </div>
          </div>

          {/* Bottom UI */}
          <div className="w-full px-6 md:px-16 pb-6 md:pb-12 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mt-auto md:mt-0 pointer-events-none">
            <div className="flex flex-col gap-2 w-full md:w-auto text-center md:text-left pointer-events-auto items-center md:items-start">
              <div ref={priceRef} className="font-sans text-6xl md:text-5xl font-light tracking-wide drop-shadow-2xl" style={{ color: product.accentColor }}>
                ${product.price}
              </div>
              <div className="text-gray-400 text-xs tracking-wider uppercase font-medium flex items-center gap-2">
                Size: <span className="text-white">29.5"</span> <span className="w-1 h-1 bg-white/50 rounded-full" /> Official
              </div>
            </div>

            <div className="w-full md:w-auto md:absolute md:left-1/2 md:-translate-x-1/2 md:bottom-12 pointer-events-auto order-last md:order-none mt-4 md:mt-0 flex justify-center gap-4">
              <button 
                onClick={onAddToCart}
                onMouseEnter={() => audioService.playHover()}
                className="interactive group relative w-full md:w-auto overflow-hidden rounded-sm px-14 py-5 shadow-glow transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{ backgroundColor: product.accentColor }}
              >
                <div className="absolute inset-0 w-full h-full bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                <span className="relative z-10 text-white font-bold text-sm tracking-[0.2em] uppercase">Add to cart</span>
              </button>
            </div>

            <div className="absolute top-1/2 right-4 -translate-y-1/2 md:static md:translate-y-0 flex flex-col items-end gap-8 pointer-events-auto">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <button onClick={onPrev} onMouseEnter={() => audioService.playHover()} className="interactive group">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center text-white bg-black/20 backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:scale-110 group-active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </div>
                </button>
                <button onClick={onNext} onMouseEnter={() => audioService.playHover()} className="interactive group">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 flex items-center justify-center text-white bg-black/20 backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:scale-110 group-active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Performance */}
      <div className="relative w-full h-full min-h-full flex items-center px-6 md:px-20 py-20 pointer-events-none snap-start overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/10" />
          <div className="absolute left-1/3 top-0 bottom-0 w-[1px] bg-white/5" />
          <div className="absolute left-2/3 top-0 bottom-0 w-[1px] bg-white/5" />
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/5" />
        </div>
        <div className="w-full h-full relative z-10 pointer-events-auto flex items-center justify-between">
          <div className="w-full md:w-1/3 flex flex-col justify-center gap-12 pl-2 md:pl-0">
            <div className="animate-item transition-all duration-1000 opacity-0 translate-y-10 delay-100">
              <div className="text-xs font-mono text-brand-orange mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-orange" /> PERFORMANCE METRICS
              </div>
              <h2 className="font-anton text-5xl md:text-7xl text-white leading-[0.9] tracking-tight uppercase">
                ELITE<br />CONTROL
              </h2>
            </div>
            <div className="space-y-8">
              <div className="animate-item transition-all duration-1000 opacity-0 translate-y-10 delay-200 border-l border-white/20 pl-6">
                <div className="text-4xl font-bold text-white mb-1">100%</div>
                <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">Microfiber Composite</div>
                <p className="text-xs text-gray-500 leading-relaxed max-w-[250px]">
                  Exclusive coating material providing superior grip management in all weather conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Aerodynamics */}
      <div className="relative w-full h-full min-h-full flex items-center justify-end px-6 md:px-16 py-20 pointer-events-none snap-start overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0 opacity-10">
          {[20, 35, 50, 65, 80].map((top) => (
            <div key={top} className="absolute left-0 right-0 h-[1px] border-t border-dashed border-white/40" style={{ top: `${top}%` }} />
          ))}
        </div>
        <div className="w-full md:w-5/12 relative z-10 pointer-events-auto text-right">
          <div className="animate-item transition-all duration-1000 opacity-0 translate-x-10 delay-100">
            <div className="inline-block px-3 py-1 border border-white/30 rounded-full text-[10px] font-mono text-white mb-4 tracking-widest uppercase">
              AERODYNAMICS
            </div>
            <h2 className="font-anton text-5xl md:text-8xl text-white mb-6 uppercase">
              PERFECT<br />FLIGHT
            </h2>
          </div>
          
          <div className="animate-item transition-all duration-1000 opacity-0 translate-x-10 delay-200 flex flex-col items-end gap-6 my-10">
            <div className="flex items-center gap-4 group">
              <div className="text-right">
                <div className="text-4xl font-bold font-mono text-white group-hover:text-brand-orange transition-colors">
                  0.85
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest">
                  Drag Coefficient
                </div>
              </div>
              <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="text-right">
                <div className="text-4xl font-bold font-mono text-white group-hover:text-brand-orange transition-colors">
                  28.5
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest">
                  Rotational Stability
                </div>
              </div>
              <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              </div>
            </div>
          </div>

          <div className="animate-item transition-all duration-1000 opacity-0 translate-y-10 delay-400 mt-12">
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm ml-auto">
              Symmetrically balanced weight distribution ensures true flight path and consistent rotation speed, critical for long-range precision.
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: The Champion */}
      <div className="relative w-full h-full min-h-full flex flex-col items-center justify-start pt-16 px-6 pointer-events-none snap-start">
        <div className="text-center pointer-events-auto z-20 relative -mt-7">
          <div className="inline-flex flex-col items-center">
            <div className="text-xs font-mono text-gray-400 tracking-[0.5em] mb-2 uppercase">LIMITED EDITION</div>
            <h2 className="animate-item transition-all duration-1000 opacity-0 translate-y-[-20px] delay-100 font-anton text-5xl md:text-7xl text-white tracking-[0.1em] drop-shadow-lg uppercase">
              THE CHAMPION
            </h2>
          </div>
        </div>
      </div>

      {/* Section 5: Defy Gravity */}
      <div className="relative w-full h-full min-h-full flex flex-col items-center justify-center pb-20 pointer-events-none snap-start overflow-hidden">
        <div className="z-20 pointer-events-auto text-center flex flex-col items-center justify-center w-full px-6 max-w-7xl mx-auto">
          <div className="animate-item transition-all duration-1000 opacity-0 translate-y-10 delay-100 relative w-full">
            <div className="inline-block px-4 py-1 border border-brand-orange rounded-full text-[10px] font-mono text-brand-orange tracking-widest mb-10 bg-black/50 backdrop-blur-sm uppercase">
              NEXT LEVEL PERFORMANCE
            </div>
            <h3 className="flex flex-col items-center justify-center text-[15vw] md:text-[9rem] font-anton uppercase tracking-tight leading-[0.8] mb-8 drop-shadow-2xl">
              <span className="text-outline text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.2)' }}>DEFY</span>
              <span className="text-white font-bold relative flex items-center gap-2">
                GRAVITY<span className="text-brand-orange">.</span>
              </span>
            </h3>
            <button 
              onClick={onAddToCart}
              onMouseEnter={() => audioService.playHover()}
              className="interactive group relative overflow-hidden bg-white text-black px-16 py-5 font-bold uppercase tracking-wider hover:bg-brand-orange hover:text-white transition-all duration-300 ease-out shadow-lg hover:shadow-glow"
            >
              <span className="relative z-10">Shop Collection</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .in-view {
          opacity: 1 !important;
          transform: translateY(0) !important;
          transform: translateX(0) !important;
        }
      `}</style>
    </div>
  );
};

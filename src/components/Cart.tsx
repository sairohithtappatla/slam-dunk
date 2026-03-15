import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { X, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { audioService } from '../services/audioService';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Product[];
  onRemoveItem: (index: number) => void;
}

export const Cart: React.FC<CartProps> = ({ isOpen, onClose, cartItems, onRemoveItem }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.5, pointerEvents: 'auto' });
      gsap.fromTo(panelRef.current, { x: '100%' }, { x: '0%', duration: 0.6, ease: "power3.out" });
    } else {
      document.body.style.overflow = '';
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.4, pointerEvents: 'none' });
      gsap.to(panelRef.current, { x: '100%', duration: 0.5, ease: "power3.in" });
    }
  }, [isOpen]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <div 
        ref={overlayRef} 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 pointer-events-none"
        onClick={onClose}
      />
      <div 
        ref={panelRef} 
        className="absolute top-0 right-0 h-full w-full md:w-[450px] bg-[#080808] border-l border-white/10 shadow-2xl flex flex-col pointer-events-auto translate-x-full"
      >
        <div className="p-8 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-anton text-3xl text-white tracking-wide uppercase">YOUR CART ({cartItems.length})</h2>
          <button onClick={onClose} onMouseEnter={() => audioService.playHover()} className="text-gray-400 hover:text-white transition-colors interactive p-2">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <ShoppingBagIcon />
              </div>
              <p className="text-sm uppercase tracking-widest">Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item, i) => (
              <div key={`${item.id}-${i}`} className="flex gap-4 bg-white/5 p-4 rounded-lg border border-white/5 animate-in slide-in-from-right-4 fade-in duration-500">
                <div className="w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-md flex items-center justify-center shrink-0">
                  <div className="w-12 h-12 rounded-full" style={{ backgroundColor: item.primaryColor, border: `2px solid ${item.lineColor}` }} />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-bold tracking-wider">{item.namePart1}{item.namePart2}</h3>
                      <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">{item.texturePattern} Edition</p>
                    </div>
                    <button onClick={() => onRemoveItem(i)} className="text-gray-500 hover:text-red-500 interactive transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="text-brand-orange text-sm font-mono">{item.primaryColor}</div>
                    <div className="text-white font-mono">${item.price.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-8 border-t border-white/10 bg-[#0a0a0a]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400 text-sm uppercase tracking-widest">Subtotal</span>
              <span className="text-white text-2xl font-anton tracking-wide">${subtotal.toFixed(2)}</span>
            </div>
            <button className="w-full bg-white text-black py-4 font-bold uppercase tracking-[0.2em] hover:bg-brand-orange hover:text-white transition-all duration-300 interactive shadow-lg">
              Checkout
            </button>
            <p className="text-center text-xs text-gray-600 mt-4 uppercase tracking-widest">Free shipping worldwide</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ShoppingBagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>
);

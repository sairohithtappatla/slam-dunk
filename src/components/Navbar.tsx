import React, { useState, useEffect } from 'react';
import { User, ShoppingBag, Menu } from 'lucide-react';
import { audioService } from '../services/audioService';

interface NavbarProps {
  cartCount: number;
  onCustomize: () => void;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onCustomize, onOpenCart }) => {
  const [isBumping, setIsBumping] = useState(false);

  useEffect(() => {
    if (cartCount > 0) {
      setIsBumping(true);
      const timer = setTimeout(() => setIsBumping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const NavLink = ({ text, active = false, onClick }: { text: string, active?: boolean, onClick?: () => void }) => (
    <button 
      onClick={onClick}
      className={`text-sm font-medium tracking-wide transition-colors duration-300 interactive ${active ? 'text-brand-orange' : 'text-gray-300 hover:text-white'}`}
    >
      {text}
    </button>
  );

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-6 md:py-8 w-full pointer-events-none md:pointer-events-auto">
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-black" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a10 10 0 0 1 0 20" opacity="0.5" />
            <path d="M2 12h20" opacity="0.5" />
          </svg>
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-anton font-bold text-white text-lg tracking-wider">SLAM</span>
          <span className="font-anton font-bold text-white text-lg tracking-wider -mt-1">DUNK</span>
        </div>
      </div>

      <div className="hidden md:flex gap-12 pointer-events-auto">
        <NavLink text="Products" active />
        <NavLink text="Customize" onClick={onCustomize} />
        <NavLink text="Contacts" />
      </div>

      <div className="flex items-center gap-6 text-white pointer-events-auto pr-2 md:pr-0">
        <button className="hover:text-brand-orange transition-colors interactive">
          <User size={20} />
        </button>
        <button 
          onClick={onOpenCart}
          className="hover:text-brand-orange transition-colors relative interactive"
        >
          <div className={`absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-brand-orange rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1 transition-transform duration-300 ${cartCount > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'} ${isBumping ? 'scale-125' : ''}`}>
            {cartCount}
          </div>
          <ShoppingBag size={24} />
        </button>
      </div>
    </nav>
  );
};

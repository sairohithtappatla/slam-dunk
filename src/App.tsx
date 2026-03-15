import { useState, useEffect, useRef } from 'react';
import { Product, PRODUCTS } from './types';
import { Scene3D } from './components/Scene3D';
import { Overlay } from './components/Overlay';
import { Configurator } from './components/Configurator';
import { Cart } from './components/Cart';
import { CustomCursor } from './components/CustomCursor';
import { audioService } from './services/audioService';

export default function App() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cart, setCart] = useState<Product[]>([]);
  const [addToCartTrigger, setAddToCartTrigger] = useState(0);
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initAudio = () => {
      audioService.init();
      window.removeEventListener('click', initAudio);
    };
    window.addEventListener('click', initAudio);
    return () => window.removeEventListener('click', initAudio);
  }, []);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % products.length);
    audioService.playClick();
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + products.length) % products.length);
    audioService.playClick();
  };

  const handleAddToCart = () => {
    setAddToCartTrigger(Date.now());
    setTimeout(() => {
      setCart(prev => [...prev, products[currentIndex]]);
      audioService.playSuccess();
    }, 800);
  };

  const handleSaveCustom = (newProduct: Product) => {
    const customProduct = {
      ...newProduct,
      id: Date.now(),
      namePart1: "CUS",
      namePart2: "TOM"
    };
    setProducts(prev => [...prev, customProduct]);
    setCurrentIndex(products.length);
  };

  const currentProduct = products[currentIndex];

  const getBgColor = (p: Product) => {
    if (p.id === 1) return "#FF5500";
    if (p.id === 2) return "#004d25";
    if (p.id === 3) return "#003f5c";
    if (p.id === 4) return "#6a040f";
    if (p.id === 5) return "#9d174d";
    return p.primaryColor;
  };

  return (
    <>
      <CustomCursor />
      
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart} 
        onRemoveItem={idx => setCart(prev => prev.filter((_, i) => i !== idx))} 
      />

      {isConfiguratorOpen && (
        <Configurator 
          onClose={() => setIsConfiguratorOpen(false)} 
          onSave={handleSaveCustom} 
          initialProduct={currentProduct} 
        />
      )}

      <div 
        ref={appRef}
        className="relative w-full h-screen flex items-center justify-center overflow-hidden p-0 md:p-8 select-none"
        style={{ 
          backgroundColor: getBgColor(currentProduct),
          transition: 'background-color 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
      >
        <div className="relative w-full h-full md:max-w-[1600px] md:max-h-[900px] bg-brand-dark md:rounded-[2.5rem] shadow-2xl flex flex-col border-0 md:border border-white/5 overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/30 via-black to-black opacity-80 pointer-events-none z-0" />
          
          {/* Grid Floor */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-1/2 opacity-20 pointer-events-none z-0"
            style={{ 
              background: 'repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(255,255,255,0.05) 50px)',
              transform: 'perspective(500px) rotateX(60deg) scale(2)',
              transformOrigin: 'bottom center',
              maskImage: 'linear-gradient(to top, black, transparent)'
            }}
          />

          <Overlay 
            product={currentProduct}
            onNext={handleNext}
            onPrev={handlePrev}
            scrollRef={scrollRef}
            cartCount={cart.length}
            onAddToCart={handleAddToCart}
            onCustomize={() => { audioService.playClick(); setIsConfiguratorOpen(true); }}
            onOpenCart={() => { audioService.playClick(); setIsCartOpen(true); }}
          />

          <Scene3D 
            currentProduct={currentProduct}
            scrollContainer={scrollRef}
            eventSource={appRef}
            addToCartTrigger={addToCartTrigger}
          />

          <div className="absolute bottom-6 left-8 text-white/30 text-xs font-bold z-50 pointer-events-none hidden md:block">
            EN / RU
          </div>

          {/* Signature */}
          <div className="absolute bottom-6 right-8 z-50 pointer-events-auto hidden md:block">
            <div className="flex flex-col items-end group">
              <span className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-sans mb-1 transition-all duration-500 group-hover:text-brand-orange group-hover:tracking-[0.6em]">
                Crafted by
              </span>
              <span className="font-signature italic text-xl text-white/40 transition-all duration-700 group-hover:text-white group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                sairohith
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

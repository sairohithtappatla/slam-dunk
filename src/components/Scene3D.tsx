import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { Basketball } from './Basketball';
import { Pedestal } from './Pedestal';
import { Particles } from './Particles';
import { AddToCartAnimation } from './AddToCartAnimation';
import { Product } from '../types';

interface Scene3DProps {
  currentProduct: Product;
  scrollContainer: React.RefObject<HTMLDivElement | null>;
  eventSource: React.RefObject<HTMLDivElement | null>;
  addToCartTrigger: number;
}

export const Scene3D: React.FC<Scene3DProps> = ({ currentProduct, scrollContainer, eventSource, addToCartTrigger }) => {
  const [animations, setAnimations] = useState<number[]>([]);

  useEffect(() => {
    if (addToCartTrigger > 0) {
      setAnimations(prev => [...prev, addToCartTrigger]);
    }
  }, [addToCartTrigger]);

  const handleAnimationComplete = (id: number) => {
    setAnimations(prev => prev.filter(a => a !== id));
  };

  return (
    <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 8], fov: 35 }}
        gl={{ antialias: true }}
        eventSource={eventSource as any}
        eventPrefix="client"
        style={{ pointerEvents: 'none' }}
      >
        <SceneContent 
          currentProduct={currentProduct} 
          scrollContainer={scrollContainer} 
          animations={animations}
          onAnimationComplete={handleAnimationComplete}
        />
      </Canvas>
    </div>
  );
};

const SceneContent: React.FC<{
  currentProduct: Product;
  scrollContainer: React.RefObject<HTMLDivElement | null>;
  animations: number[];
  onAnimationComplete: (id: number) => void;
}> = ({ currentProduct, scrollContainer, animations, onAnimationComplete }) => {
  const [scrollStage, setScrollStage] = useState(1);
  const { viewport } = useThree();

  useFrame(() => {
    if (scrollContainer.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer.current;
      const maxScroll = scrollHeight - clientHeight;
      const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
      
      if (progress > 0.83) setScrollStage(6);
      else if (progress > 0.66) setScrollStage(5);
      else if (progress > 0.5) setScrollStage(4);
      else if (progress > 0.33) setScrollStage(3);
      else if (progress > 0.16) setScrollStage(2);
      else setScrollStage(1);
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight
        position={[-5, 10, 5]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        castShadow
        shadow-bias={-0.0001}
      />
      <spotLight
        position={[5, 0, -5]}
        angle={0.5}
        penumbra={1}
        intensity={5}
        color={currentProduct.accentColor}
      />
      <pointLight position={[-5, 0, 5]} intensity={0.8} color="#4a5568" />
      
      <Basketball product={currentProduct} scrollContainer={scrollContainer} />
      
      {animations.map(id => (
        <AddToCartAnimation
          key={id}
          id={id}
          product={currentProduct}
          onComplete={onAnimationComplete}
          viewportWidth={viewport.width}
          viewportHeight={viewport.height}
        />
      ))}

      <Pedestal visible={scrollStage === 5} />
      <Particles product={currentProduct} active={scrollStage === 6} />
      
      <ContactShadows
        opacity={0.6}
        scale={10}
        blur={2.5}
        far={4}
        resolution={256}
        color="#000000"
      />
      
      <Environment preset="studio" />
    </>
  );
};

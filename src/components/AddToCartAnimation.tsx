import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { Product } from '../types';
import { generateBasketballTextures } from '../lib/textures';
import { audioService } from '../services/audioService';

interface AddToCartAnimationProps {
  id: number;
  product: Product;
  onComplete: (id: number) => void;
  viewportWidth: number;
  viewportHeight: number;
}

export const AddToCartAnimation: React.FC<AddToCartAnimationProps> = ({ id, product, onComplete, viewportWidth, viewportHeight }) => {
  const groupRef = useRef<THREE.Group>(null);
  const ballRef = useRef<THREE.Mesh>(null);
  const flashRef = useRef<THREE.Mesh>(null);
  const trailRefs = useRef<(THREE.Mesh | null)[]>([]);

  const { map, normalMap } = generateBasketballTextures(product.primaryColor, product.lineColor, product.texturePattern);

  useEffect(() => {
    if (!groupRef.current) return;

    const isMobile = viewportWidth < viewportHeight;
    const startPos = new THREE.Vector3(0, isMobile ? 1.2 : 0, 0);
    
    const isSmall = viewportWidth < 6;
    const offsetX = isSmall ? 0.8 : 1.5;
    const offsetY = isSmall ? 0.8 : 1.2;
    const cartPos = new THREE.Vector3(viewportWidth / 2 - offsetX, viewportHeight / 2 - offsetY, 0);
    
    // Randomize slightly
    cartPos.x += (Math.random() - 0.5) * 0.2;
    cartPos.y += (Math.random() - 0.5) * 0.2;

    const peakPos = new THREE.Vector3().subVectors(cartPos, startPos).clone().normalize().negate().multiplyScalar(3.5);
    const ballScale = isSmall ? 0.75 : 0.85;

    if (ballRef.current) {
      ballRef.current.position.copy(startPos);
      ballRef.current.scale.setScalar(ballScale);
    }

    audioService.playSwoosh();

    const tl = gsap.timeline({ onComplete: () => onComplete(id) });

    tl.to(groupRef.current.position, {
      x: peakPos.x,
      y: peakPos.y,
      z: -5,
      duration: 0.4,
      ease: "back.out(1.5)"
    }, 0);

    if (ballRef.current) {
      tl.to((ballRef.current.material as THREE.MeshStandardMaterial), {
        emissiveIntensity: 3,
        duration: 0.4,
        ease: "power2.in"
      }, 0);
    }

    const flyDuration = 0.55;
    tl.to(groupRef.current.position, {
      x: cartPos.x - startPos.x,
      y: cartPos.y - startPos.y,
      z: 0,
      duration: flyDuration,
      ease: "power4.in"
    }, 0.4);

    if (ballRef.current) {
      tl.to(ballRef.current.rotation, {
        x: "+=" + Math.PI * 6,
        y: "+=" + Math.PI * 6,
        duration: flyDuration + 0.4,
        ease: "power1.inOut"
      }, 0);
    }

    trailRefs.current.forEach((trail, i) => {
      if (!trail) return;
      trail.visible = true;
      const delay = 0.4 + i * 0.015;
      tl.to(trail.position, {
        x: cartPos.x,
        y: cartPos.y,
        z: 0,
        duration: flyDuration,
        ease: "power4.in"
      }, delay);
      tl.to(trail.scale, { x: 0, y: 0, z: 0, duration: 0.2, ease: "power1.in" }, delay + flyDuration - 0.2);
    });

    const hitTime = 0.4 + flyDuration;
    tl.to(ballRef.current!.scale, { x: 0, y: 0, z: 0, duration: 0.1, ease: "power1.out" }, hitTime - 0.05);
    tl.call(() => {
      if (flashRef.current) flashRef.current.visible = true;
      audioService.playSuccess();
    }, [], hitTime - 0.05);

    if (flashRef.current) {
      tl.to(flashRef.current.scale, { x: 2.5, y: 2.5, z: 1, duration: 0.3, ease: "out" }, hitTime - 0.05);
      tl.to((flashRef.current.material as THREE.MeshBasicMaterial), { opacity: 0, duration: 0.3, ease: "power1.in" }, hitTime - 0.05);
    }

  }, []);

  return (
    <group ref={groupRef}>
      <mesh ref={ballRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          map={map}
          normalMap={normalMap}
          color={product.primaryColor}
          roughness={0.4}
          metalness={0.1}
          emissive={product.accentColor}
          emissiveIntensity={0}
        />
      </mesh>
      
      <mesh ref={flashRef} visible={false}>
        <circleGeometry args={[0.8, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={1} side={THREE.DoubleSide} />
      </mesh>

      {Array.from({ length: 12 }).map((_, i) => (
        <mesh
          key={i}
          ref={el => trailRefs.current[i] = el}
          visible={false}
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color={product.primaryColor} transparent opacity={0.4} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
};

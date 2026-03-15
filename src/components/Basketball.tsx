import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { Product } from '../types';
import { generateBasketballTextures } from '../lib/textures';

interface BasketballProps {
  product: Product;
  scrollContainer: React.RefObject<HTMLDivElement | null>;
  isConfigurator?: boolean;
}

export const Basketball: React.FC<BasketballProps> = ({ product, scrollContainer, isConfigurator = false }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const rotationRef = useRef({ x: 0, y: 0, z: 0 });
  const dragRotationRef = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const { map, normalMap } = useMemo(() => 
    generateBasketballTextures(product.primaryColor, product.lineColor, product.texturePattern),
    [product.primaryColor, product.lineColor, product.texturePattern]
  );

  useEffect(() => {
    if (meshRef.current) {
      gsap.to(rotationRef.current, {
        y: rotationRef.current.y + Math.PI * 3,
        x: rotationRef.current.x + Math.PI * 0.75,
        duration: 1.4,
        ease: "power4.inOut"
      });
      
      gsap.timeline()
        .to(meshRef.current.scale, { x: 0.75, y: 0.75, z: 0.75, duration: 0.2, ease: "power2.in" })
        .to(meshRef.current.scale, { x: 0.85, y: 0.85, z: 0.85, duration: 1.2, ease: "elastic.out(1, 0.4)" });
    }
  }, [product]);

  useFrame((state) => {
    if (!meshRef.current) return;

    if (isConfigurator) {
      meshRef.current.rotation.x = dragRotationRef.current.x;
      meshRef.current.rotation.y = dragRotationRef.current.y + state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.z = 0;
      meshRef.current.position.set(0, 0, 0);
      meshRef.current.scale.setScalar(1);
      return;
    }

    let scrollProgress = 0;
    if (scrollContainer.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer.current;
      const maxScroll = scrollHeight - clientHeight;
      scrollProgress = maxScroll > 0 ? scrollTop / maxScroll : 0;
    }
    scrollProgress = Math.min(Math.max(scrollProgress, 0), 1);

    const width = state.viewport.width;
    const height = state.viewport.height;
    const isMobile = width < height;
    const isTablet = !isMobile && width < 6.5;

    let yOffset = isMobile ? 1.2 : (isTablet ? -0.3 : 0);
    const startPos = new THREE.Vector3(0, yOffset, 0);
    const startScale = isMobile ? 0.75 : 0.85;

    const pos1 = new THREE.Vector3(width / 2, 0, 0);
    const scale1 = isMobile ? 1.2 : 2.5;

    const pos2 = new THREE.Vector3(-width / 2, 0, 0);
    const scale2 = isMobile ? 1.5 : 3.5;

    const pos3 = new THREE.Vector3(0, 0, 0);
    const scale3 = isMobile ? 0.9 : 1;

    const pos4 = new THREE.Vector3(0, 0, 0);
    const scale4 = isMobile ? 0.9 : 1;

    const endPos = new THREE.Vector3(0, 10, 0);
    const endScale = 1;

    let targetPos = new THREE.Vector3();
    let targetScale = 1;
    let opacityFactor = 1;

    const ease = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

    if (scrollProgress <= 0.2) {
      const t = ease(scrollProgress * 5);
      targetPos.lerpVectors(startPos, pos1, t);
      targetScale = THREE.MathUtils.lerp(startScale, scale1, t);
    } else if (scrollProgress <= 0.4) {
      const t = ease((scrollProgress - 0.2) * 5);
      targetPos.lerpVectors(pos1, pos2, t);
      targetScale = THREE.MathUtils.lerp(scale1, scale2, t);
    } else if (scrollProgress <= 0.6) {
      const t = ease((scrollProgress - 0.4) * 5);
      targetPos.lerpVectors(pos2, pos3, t);
      targetScale = THREE.MathUtils.lerp(scale2, scale3, t);
    } else if (scrollProgress <= 0.8) {
      const t = ease((scrollProgress - 0.6) * 5);
      targetPos.lerpVectors(pos3, pos4, t);
      targetScale = THREE.MathUtils.lerp(scale3, scale4, t);
      opacityFactor = 1 - t;
    } else {
      const t = ease((scrollProgress - 0.8) * 5);
      targetPos.lerpVectors(pos4, endPos, t);
      targetScale = THREE.MathUtils.lerp(scale4, endScale, t);
      opacityFactor = t * 5;
    }

    meshRef.current.position.lerp(targetPos, 0.08);
    
    if (opacityFactor > 0.01) {
      rotationRef.current.x = scrollProgress * Math.PI * 6;
      rotationRef.current.y += (0.005 + scrollProgress * 0.1) * opacityFactor;
    } else {
      rotationRef.current.x = THREE.MathUtils.lerp(rotationRef.current.x, 0, 0.05);
      rotationRef.current.y += 0.002;
    }

    if (scrollProgress > 0.05 && !isDragging.current) {
      dragRotationRef.current.x = THREE.MathUtils.lerp(dragRotationRef.current.x, 0, 0.1);
      dragRotationRef.current.y = THREE.MathUtils.lerp(dragRotationRef.current.y, 0, 0.1);
    }

    meshRef.current.rotation.x = rotationRef.current.x + dragRotationRef.current.x;
    meshRef.current.rotation.y = rotationRef.current.y + dragRotationRef.current.y;
    meshRef.current.rotation.z = rotationRef.current.z;

    if (scrollProgress < 0.05) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.05 * 0.05;
    }

    meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1));
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    document.body.style.cursor = 'grabbing';
  };

  const handlePointerUp = (e: any) => {
    e.stopPropagation();
    e.target.releasePointerCapture(e.pointerId);
    isDragging.current = false;
    document.body.style.cursor = 'grab';
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging.current) return;
    e.stopPropagation();
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    dragRotationRef.current.y += deltaX * 0.005;
    dragRotationRef.current.x += deltaY * 0.005;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <mesh
      ref={meshRef}
      castShadow
      receiveShadow
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerOver={() => { if (!isDragging.current) document.body.style.cursor = 'grab'; }}
      onPointerOut={() => { if (!isDragging.current) document.body.style.cursor = 'auto'; }}
    >
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={map}
        normalMap={normalMap}
        normalScale={new THREE.Vector2(0.8, 0.8)}
        color={product.primaryColor}
        roughness={product.id === 3 ? 0.4 : 0.55}
        metalness={product.id === 3 ? 0.2 : 0.1}
        envMapIntensity={0.6}
      />
    </mesh>
  );
};

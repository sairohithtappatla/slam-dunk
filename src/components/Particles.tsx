import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Product } from '../types';

export const Particles: React.FC<{ product: Product; active: boolean }> = ({ product, active }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 50;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  const particles = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        0.05 + Math.random() * 0.1,
        (Math.random() - 0.5) * 0.02
      ),
      rotation: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05
      ),
      baseScale: 0.2 + Math.random() * 0.6,
      currentScale: 0,
      color: Math.random() > 0.7 ? product.accentColor : "#2a2a2a"
    }));
  }, [product.accentColor]);

  useEffect(() => {
    if (meshRef.current) {
      particles.forEach((p, i) => {
        color.set(p.color);
        meshRef.current!.setColorAt(i, color);
      });
      meshRef.current.instanceColor!.needsUpdate = true;
    }
  }, [particles, color]);

  useFrame(() => {
    if (!meshRef.current) return;

    const topBound = 12;
    const bottomBound = -12;

    particles.forEach((p, i) => {
      const targetScale = active ? p.baseScale : 0;
      p.currentScale = THREE.MathUtils.lerp(p.currentScale, targetScale, 0.1);

      if (active || p.currentScale > 0.01) {
        p.position.add(p.velocity);
        p.rotation.x += p.rotSpeed.x;
        p.rotation.y += p.rotSpeed.y;

        if (p.position.y > topBound) {
          p.position.y = bottomBound;
          p.position.x = (Math.random() - 0.5) * 30;
        }
      }

      dummy.position.copy(p.position);
      dummy.rotation.set(p.rotation.x, p.rotation.y, p.rotation.z);
      dummy.scale.setScalar(p.currentScale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#ffffff" roughness={0.7} metalness={0.4} flatShading />
    </instancedMesh>
  );
};

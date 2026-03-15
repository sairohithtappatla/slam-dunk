import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MeshReflectorMaterial } from '@react-three/drei';

export const Pedestal: React.FC<{ visible: boolean }> = ({ visible }) => {
  const groupRef = useRef<THREE.Group>(null);
  const targetY = visible ? -1.5 : -10;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.08);
      if (visible) {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      }
    }
  });

  const Tier = ({ y, radius, height, color }: { y: number, radius: number, height: number, color: string }) => (
    <mesh position={[0, y, 0]} receiveShadow castShadow>
      <cylinderGeometry args={[radius, radius, height, 64]} />
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
      <mesh position={[0, height / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.05, radius, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
      </mesh>
    </mesh>
  );

  return (
    <group ref={groupRef} position={[0, -10, 0]}>
      <Tier y={-1} radius={3.5} height={0.6} color="#0a0a0a" />
      <Tier y={-0.4} radius={2.5} height={0.6} color="#151515" />
      
      <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.6, 64]} />
        <meshStandardMaterial color="#202020" roughness={0.2} metalness={0.8} />
      </mesh>

      <mesh position={[0, 0.505, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 64]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={20}
          roughness={0.2}
          depthScale={1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#202020"
          metalness={0.8}
          mirror={0.7}
        />
      </mesh>

      <mesh position={[0, 0.51, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.3, 1.4, 64]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
    </group>
  );
};

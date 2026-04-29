import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, OrbitControls, PerspectiveCamera, Stars, Text, Trail, PresentationControls } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function ChargingNode({ position, color = "#39ff14" }: { position: [number, number, number], color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.002;
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[0.1, 16, 16]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </Sphere>
      <pointLight color={color} intensity={1} distance={2} />
    </group>
  );
}

function CarSilhouette({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null!);
  
  useFrame((state) => {
    meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.8) * 0.001;
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Abstract Car Body */}
      <mesh>
        <boxGeometry args={[1.5, 0.4, 0.8]} />
        <meshStandardMaterial color="#111" transparent opacity={0.8} />
      </mesh>
      {/* Top cabin */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.8, 0.3, 0.6]} />
        <meshStandardMaterial color="#39ff14" transparent opacity={0.2} emissive="#39ff14" emissiveIntensity={0.5} />
      </mesh>
      {/* Headlights */}
      <mesh position={[0.76, 0, 0.25]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={5} />
      </mesh>
      <mesh position={[0.76, 0, -0.25]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={5} />
      </mesh>
    </group>
  );
}

function ChargingStation() {
  const baseRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    baseRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <group ref={baseRef}>
      {/* Abstract Base */}
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[1.2, 0.2, 1.2]} />
        <meshStandardMaterial color="#050505" />
      </mesh>
      
      {/* Main Column */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 2.2, 0.4]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>

      {/* Interface Pulsing Screen */}
      <mesh position={[0, 0.6, 0.21]}>
        <planeGeometry args={[0.35, 0.5]} />
        <MeshDistortMaterial 
          color="#111" 
          emissive="#39ff14" 
          emissiveIntensity={1} 
          speed={2} 
          distort={0.1}
        />
      </mesh>

      {/* Charging Cable Concept */}
      <Trail
        width={1}
        length={8}
        color={new THREE.Color('#39ff14')}
        attenuation={(t) => t * t}
      >
        <ChargingNode position={[1.5, 0.5, -1]} color="#39ff14" />
      </Trail>

      <CarSilhouette position={[-2, -0.7, 1]} />

      {/* Glowing accents */}
      <mesh position={[0.26, 0, 0]}>
        <boxGeometry args={[0.02, 2.1, 0.1]} />
        <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={2} />
      </mesh>
      <mesh position={[-0.26, 0, 0]}>
        <boxGeometry args={[0.02, 2.1, 0.1]} />
        <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={2} />
      </mesh>

      {/* Data Nodes */}
      <ChargingNode position={[1, 1.5, 1]} color="#00f2ff" />
      <ChargingNode position={[-1.2, 0.8, -1]} color="#39ff14" />
    </group>
  );
}

function Grid() {
  return (
    <gridHelper args={[30, 30, "#1a1a1a", "#0a0a0a"]} position={[0, -1, 0]} />
  );
}

export default function ChargingScene() {
  return (
    <div className="w-full h-full min-h-[500px]">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[4, 2, 6]} fov={45} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
        >
          <ChargingStation />
        </PresentationControls>

        <Grid />
        <fog attach="fog" args={['#050505', 5, 20]} />
      </Canvas>
    </div>
  );
}

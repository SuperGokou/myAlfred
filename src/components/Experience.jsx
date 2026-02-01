import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store';

const FluidOrb = () => {
    const meshRef = useRef();
    const lightRef = useRef();
    const status = useStore((state) => state.status);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // 1. Idle Animation (Gentle Floating)
        meshRef.current.rotation.x = t * 0.4;
        meshRef.current.rotation.y = t * 0.2;

        // 2. State Reactions
        const distortStrength = status === 'listening' ? 0.6 : 0.4;
        const distortSpeed = status === 'listening' ? 5 : 2;

        // Lerp (Smooth Transition) logic for distortion
        meshRef.current.material.distort = THREE.MathUtils.lerp(
            meshRef.current.material.distort,
            distortStrength,
            0.1
        );

        // Color & Scale Logic
        if (status === 'listening') {
            // Focus Mode: Shrink slightly, turn Cyan/White, vibrate fast
            const scale = 1 + Math.sin(t * 10) * 0.05;
            meshRef.current.scale.setScalar(scale);
            meshRef.current.material.color.lerp(new THREE.Color("#00FFFF"), 0.1); // Cyan
            meshRef.current.material.speed = 5; // Fast liquid
        }
        else if (status === 'speaking') {
            // Speak Mode: Expand, pulse slow, turn Magenta/Pink
            const scale = 1.2 + Math.sin(t * 3) * 0.2;
            meshRef.current.scale.setScalar(scale);
            meshRef.current.material.color.lerp(new THREE.Color("#FF00FF"), 0.1); // Magenta
            meshRef.current.material.speed = 2; // Slow, heavy liquid
        }
        else {
            // Idle Mode: Normal size, Deep Violet
            meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
            meshRef.current.material.color.lerp(new THREE.Color("#7B2CBF"), 0.1); // Deep Purple
            meshRef.current.material.speed = 1.5; // Calm
        }
    });

    return (
        <group>
            {/* The Liquid Shell */}
            <Sphere ref={meshRef} args={[2.2, 64, 64]}>
                <MeshDistortMaterial
                    attach="material"
                    color="#7B2CBF" // Initial color
                    envMapIntensity={1}
                    clearcoat={1}
                    roughness={0}
                    metalness={0.2}
                    distort={0.4} // Strength of the wiggle
                    speed={2}     // Speed of the wiggle
                />
            </Sphere>

            {/* Inner Glow Light (Inside the liquid) */}
            <pointLight ref={lightRef} intensity={2} color="white" distance={5} />

            {/* Background Glow */}
            <pointLight position={[-10, -10, -10]} intensity={5} color="#480048" />
            <pointLight position={[10, 10, 10]} intensity={2} color="#004080" />
        </group>
    );
};

export default function Experience() {
    return (
        <>
            <color attach="background" args={['#05000a']} />
            <ambientLight intensity={0.5} />
            <FluidOrb />
        </>
    );
}
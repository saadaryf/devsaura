import React from 'react';
import { Text3D, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const LoadingScreen = ({ progress }) => {
    const groupRef = React.useRef();
    const textRef = React.useRef();

    useFrame(({ clock }) => {
        if (groupRef.current) {
            const t = clock.getElapsedTime();
            groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
        }
        if (textRef.current?.material) {
            textRef.current.material.opacity = 0.5 + Math.sin(clock.getElapsedTime() * 2) * 0.5;
        }
    });

    return (
        <Float
            speed={1.5}
            rotationIntensity={0.5}
            floatIntensity={0.5}
        >
            <group ref={groupRef}>
                <Text3D
                    ref={textRef}
                    font="/fonts/helvetiker_regular.typeface.json"
                    size={0.5}
                    height={0.1}
                    curveSegments={12}
                    bevelEnabled
                    bevelThickness={0.02}
                    bevelSize={0.02}
                    bevelOffset={0}
                    bevelSegments={5}
                    position={[-2, 0, 0]}
                >
                    {`Loading ${Math.floor(progress)}%`}
                    <meshBasicMaterial
                        color={0x00ffff}
                        transparent
                        opacity={0.8}
                        side={THREE.DoubleSide}
                    />
                </Text3D>
            </group>
        </Float>
    );
};
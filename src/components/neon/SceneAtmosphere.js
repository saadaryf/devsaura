
// src/components/neon/SceneAtmosphere.js
import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const SceneAtmosphere = () => {
    const atmosphereRef = useRef();

    useFrame(({ clock }) => {
        if (atmosphereRef.current) {
            const time = clock.getElapsedTime();
            atmosphereRef.current.rotation.y = time * 0.05;
            atmosphereRef.current.rotation.z = time * 0.03;
        }
    });

    return (
        <mesh ref={atmosphereRef}>
            <sphereGeometry args={[40, 64, 64]} />
            <meshBasicMaterial
                color={0x0088ff}
                transparent
                opacity={0.03}
                side={THREE.BackSide}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
};
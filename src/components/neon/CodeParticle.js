import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text3D } from '@react-three/drei';

export const CodeParticle = ({ position, symbol, color, speed }) => {
    const ref = useRef();
    const startPos = useMemo(() => new THREE.Vector3(...position), [position]);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();
        ref.current.position.y -= speed;
        ref.current.position.x += Math.sin(time + startPos.x) * 0.01;

        if (ref.current.position.y < -10) {
            ref.current.position.y = 20;
            ref.current.position.x = startPos.x;
        }
    });

    return (
        <mesh ref={ref} position={position}>
            <Text3D
                font="/fonts/helvetiker_regular.typeface.json"
                size={0.15}
                height={0.02}
            >
                {symbol}
                <meshBasicMaterial color={color} transparent opacity={0.6} />
            </Text3D>
        </mesh>
    );
};

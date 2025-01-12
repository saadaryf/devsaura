import React, { useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text3D } from '@react-three/drei';
import { DEV_SYMBOLS, KEYWORDS } from './constants/devSymbols';
import { CodeParticle } from './CodeParticle';

export const DevParticleSystem = () => {
    const createParticles = useCallback(() => {
        const items = [];
        // Matrix-style falling code particles
        for (let i = 0; i < 50; i++) {
            items.push({
                type: 'code',
                position: [
                    (Math.random() - 0.5) * 30,
                    Math.random() * 30,
                    (Math.random() - 0.5) * 30
                ],
                symbol: DEV_SYMBOLS[Math.floor(Math.random() * DEV_SYMBOLS.length)],
                color: new THREE.Color(0x00ff00).multiplyScalar(0.8),
                speed: 0.05 + Math.random() * 0.1
            });
        }

        // Floating keywords
        for (let i = 0; i < 30; i++) {
            items.push({
                type: 'keyword',
                position: [
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 20
                ],
                text: KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)],
                color: new THREE.Color(0x00ffff),
                scale: 0.2 + Math.random() * 0.3
            });
        }

        return items;
    }, []);

    const particles = useMemo(() => createParticles(), [createParticles]);
    const floatingParticlesRef = useRef();

    useFrame(({ clock }) => {
        if (floatingParticlesRef.current) {
            const time = clock.getElapsedTime();
            floatingParticlesRef.current.rotation.y = time * 0.03;

            floatingParticlesRef.current.children.forEach((child, i) => {
                child.position.y += Math.sin(time * 0.5 + i) * 0.002;
                child.rotation.z = Math.sin(time * 0.3 + i) * 0.1;
            });
        }
    });

    return (
        <>
            {particles.filter(p => p.type === 'code').map((particle, i) => (
                <CodeParticle key={`code-${i}`} {...particle} />
            ))}
            <group ref={floatingParticlesRef}>
                {particles.filter(p => p.type === 'keyword').map((particle, i) => (
                    <Text3D
                        key={`keyword-${i}`}
                        font="/fonts/helvetiker_regular.typeface.json"
                        size={particle.scale}
                        height={0.02}
                        position={particle.position}
                    >
                        {particle.text}
                        <meshBasicMaterial
                            color={particle.color}
                            transparent
                            opacity={0.6}
                            blending={THREE.AdditiveBlending}
                        />
                    </Text3D>
                ))}
            </group>
        </>
    );
};

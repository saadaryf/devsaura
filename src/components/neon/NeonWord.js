import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text3D, Float } from '@react-three/drei';
import { vertexShader, fragmentShader } from './shaders/neonShaders';

export const NeonWord = ({ text, position, color, wordMix }) => {
    const materialRef = useRef();
    const textRef = useRef();

    useFrame(({ clock }) => {
        if (materialRef.current) {
            materialRef.current.uniforms.time.value = clock.getElapsedTime();
        }
    });

    const neonMaterial = useMemo(
        () =>
            new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(color) },
                    secondaryColor: { value: new THREE.Color(0x00ffff) },
                    wordMix: { value: wordMix }
                },
                vertexShader,
                fragmentShader,
                transparent: true,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide,
                depthWrite: false,
            }),
        [color, wordMix]
    );

    return (
        <Float
            speed={1.5}
            rotationIntensity={0.3}
            floatIntensity={0.7}
            floatingRange={[-0.2, 0.2]}
        >
            <Text3D
                ref={textRef}
                font="/fonts/helvetiker_regular.typeface.json"
                size={0.8}
                height={0.2}
                curveSegments={64}
                bevelEnabled
                bevelThickness={0.05}
                bevelSize={0.04}
                bevelOffset={0}
                bevelSegments={32}
                position={position}
            >
                {text}
                <primitive object={neonMaterial} ref={materialRef} />
            </Text3D>
        </Float>
    );
};
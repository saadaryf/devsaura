import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { nebulaVertexShader, nebulaFragmentShader } from './shaders/nebulaShaders';

export const SceneAtmosphere = () => {
    const meshRef = useRef();
    const materialRef = useRef();

    // Create and memoize nebula material
    const nebulaMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color1: { value: new THREE.Color(0x120024) }, // Deep space purple
                color2: { value: new THREE.Color(0x3b0084) }, // Rich nebula purple
                color3: { value: new THREE.Color(0x7800ff) }, // Bright nebula core
                color4: { value: new THREE.Color(0x00ffff) }  // Cyan accents
            },
            vertexShader: nebulaVertexShader,
            fragmentShader: nebulaFragmentShader,
            side: THREE.BackSide,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
    }, []);

    // Memoize background material
    const backgroundMaterial = useMemo(() => {
        return new THREE.MeshBasicMaterial({
            color: 0x000016,
            side: THREE.BackSide,
            depthWrite: false
        });
    }, []);

    useFrame(({ clock }) => {
        if (materialRef.current) {
            materialRef.current.uniforms.time.value = clock.getElapsedTime() * 0.1;
        }
    });

    return (
        <>
            {/* Background sphere */}
            <mesh scale={[60, 60, 60]}>
                <sphereGeometry args={[1, 16, 16]} />
                <primitive object={backgroundMaterial} />
            </mesh>

            {/* Nebula sphere */}
            <mesh
                ref={meshRef}
                scale={[40, 40, 40]}
                renderOrder={-1}
            >
                <sphereGeometry args={[1, 48, 48]} />
                <primitive object={nebulaMaterial} ref={materialRef} />
            </mesh>
        </>
    );
};
// NeonScene.js
import React, { useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text3D, Float } from '@react-three/drei';

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying float vDistanceFromCenter;

void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    vDistanceFromCenter = length(position.xy);
    gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
uniform float time;
uniform vec3 color;
uniform vec3 secondaryColor;
uniform float wordMix;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying float vDistanceFromCenter;

vec3 plasma(vec2 uv, float time) {
    float v = 0.0;
    vec2 c = uv * 2.0 - 1.0;
    v += sin((c.x + time) * 10.0) * 0.5;
    v += sin((c.y + time) * 10.0) * 0.5;
    v += sin((c.x + c.y + time) * 10.0) * 0.5;
    return vec3(
        sin(v * 3.14159 * 2.0) * 0.5 + 0.5,
        sin(v * 3.14159 * 2.0 + 2.094) * 0.5 + 0.5,
        sin(v * 3.14159 * 2.0 + 4.188) * 0.5 + 0.5
    );
}

float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);
    float res = mix(
        mix(dot(vec2(1.0), u), dot(vec2(-1.0, 1.0), u - vec2(1.0, 0.0)), u.x),
        mix(dot(vec2(1.0, -1.0), u - vec2(0.0, 1.0)), dot(vec2(-1.0), u - vec2(1.0)), u.x),
        u.y
    );
    return res * 0.5 + 0.5;
}

void main() {
    float glow = 2.0 - length(vUv * 2.0 - 1.0);
    glow = pow(glow, 1.2);
    
    vec3 baseColor = mix(color, secondaryColor, wordMix);
    vec3 plasmaColor = plasma(vUv, time * 0.5);
    float noiseVal = noise(vUv * 10.0 + time * 0.5);
    
    float pulse1 = sin(time * 1.5) * 0.1 + 0.9;
    float pulse2 = sin(time * 2.3 + vDistanceFromCenter) * 0.1 + 0.9;
    float pulse3 = sin(time * 3.7 - vDistanceFromCenter) * 0.1 + 0.9;
    float compositePulse = (pulse1 + pulse2 + pulse3) / 3.0;
    
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - max(0.0, dot(normalize(vNormal), viewDir)), 2.0);
    vec3 fresnelColor = vec3(fresnel * 1.2, fresnel, fresnel * 0.8);
    
    float energyFlow = sin(vDistanceFromCenter * 10.0 - time * 3.0) * 0.5 + 0.5;
    
    vec3 finalColor = baseColor * (glow * compositePulse * 1.5);
    finalColor += plasmaColor * 0.2 * energyFlow;
    finalColor += fresnelColor * 0.5;
    finalColor += vec3(noiseVal * 0.1);
    
    finalColor = max(finalColor, baseColor * 0.5);
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`;

const NeonWord = ({ text, position, color, wordMix }) => {
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

const CodeParticle = ({ position, symbol, color, speed }) => {
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

// Constants moved outside component to avoid recreating on each render
const DEV_SYMBOLS = [
    '{', '}', '()', '[]', '<>', '//', '{}',
    '+=', '=>', '&&', '||', '!=', '==',
    'js', 'py', '</>', '01', '$_', '#',
];

const KEYWORDS = [
    'function', 'const', 'let', 'var',
    'class', 'import', 'export',
    'async', 'await', 'try',
    'map', 'filter', 'reduce',
];

const DevParticleSystem = () => {
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

const SceneAtmosphere = () => {
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

const NeonScene = () => {
    return (
        <>
            <NeonWord
                text="DEVS"
                position={[-2.5, 0, 0]}
                color={0xff00ff}
                wordMix={0}
            />
            <NeonWord
                text="AURA"
                position={[0.3, 0, 0]}
                color={0x00ffff}
                wordMix={1}
            />
            <DevParticleSystem />
            <SceneAtmosphere />
        </>
    );
};

export default NeonScene;
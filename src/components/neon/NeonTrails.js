import React, { useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const NeonTrail = ({ startPosition, color }) => {
    const mainLineRef = useRef();
    const glowLineRef = useRef();
    const pointsRef = useRef([]);
    const timeRef = useRef(0);
    const headPositionRef = useRef(new THREE.Vector3(...startPosition));
    const targetRef = useRef(new THREE.Vector3(
        startPosition[0] + (Math.random() - 0.5) * 10,
        startPosition[1] + (Math.random() - 0.5) * 10,
        startPosition[2] + (Math.random() - 0.5) * 10
    ));

    // Initialize trail points
    if (pointsRef.current.length === 0) {
        for (let i = 0; i < 20; i++) { // More points for smoother trail
            pointsRef.current.push(new THREE.Vector3(...startPosition));
        }
    }

    const updateTarget = () => {
        targetRef.current.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );
    };

    useFrame((state, delta) => {
        if (!mainLineRef.current) return;

        timeRef.current += delta;

        // Update head position
        const head = headPositionRef.current;
        const target = targetRef.current;
        const distanceToTarget = head.distanceTo(target);

        // If close to target, get new target
        if (distanceToTarget < 0.5) {
            updateTarget();
        }

        // Move head towards target
        const direction = target.clone().sub(head).normalize();
        const speed = 0.05;
        head.add(direction.multiplyScalar(speed));

        // Add some wavey motion
        head.x += Math.sin(timeRef.current * 2) * 0.02;
        head.y += Math.cos(timeRef.current * 1.5) * 0.02;
        head.z += Math.sin(timeRef.current * 1.7) * 0.02;

        // Update trail points
        for (let i = pointsRef.current.length - 1; i > 0; i--) {
            const current = pointsRef.current[i];
            const prev = pointsRef.current[i - 1];
            const lerpFactor = 0.7; // Higher value = stiffer trail
            current.lerp(prev, lerpFactor);
        }
        pointsRef.current[0].copy(head);

        // Update geometries
        const curve = new THREE.CatmullRomCurve3(pointsRef.current);
        const points = curve.getPoints(50);

        mainLineRef.current.geometry.setFromPoints(points);
        if (glowLineRef.current) {
            glowLineRef.current.geometry.setFromPoints(points);
        }

        // Update opacities for fade out
        if (timeRef.current > 15) {
            const fadeAmount = 0.005;
            mainLineRef.current.material.opacity -= fadeAmount;
            if (glowLineRef.current) {
                glowLineRef.current.material.opacity -= fadeAmount;
            }
        }
    });

    return (
        <group>
            {/* Main bright line */}
            <line ref={mainLineRef}>
                <bufferGeometry />
                <lineBasicMaterial
                    color={color}
                    linewidth={2}
                    transparent
                    opacity={1}
                    blending={THREE.AdditiveBlending}
                />
            </line>

            {/* Outer glow */}
            <line ref={glowLineRef}>
                <bufferGeometry />
                <lineBasicMaterial
                    color={color}
                    linewidth={4}
                    transparent
                    opacity={0.4}
                    blending={THREE.AdditiveBlending}
                />
            </line>
        </group>
    );
};

export const NeonTrails = () => {
    const [trails, setTrails] = useState(() => {
        const initialTrails = [];
        const colors = [0xff00ff, 0x00ffff, 0xff1493, 0x00ff00];

        // Start with fewer trails
        for (let i = 0; i < 3; i++) {
            initialTrails.push({
                id: Math.random(),
                position: [
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 10
                ],
                color: new THREE.Color(
                    colors[Math.floor(Math.random() * colors.length)]
                ).multiplyScalar(2),
                time: 0
            });
        }
        return initialTrails;
    });

    const timeRef = useRef(0);

    const addTrail = useCallback(() => {
        const colors = [0xff00ff, 0x00ffff, 0xff1493, 0x00ff00];
        return {
            id: Math.random(),
            position: [
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            ],
            color: new THREE.Color(
                colors[Math.floor(Math.random() * colors.length)]
            ).multiplyScalar(2),
            time: timeRef.current
        };
    }, []);

    useFrame((state, delta) => {
        timeRef.current += delta;

        setTrails(currentTrails => {
            const updatedTrails = currentTrails
                .filter(trail => trail.time + 18 > timeRef.current);

            if (Math.random() < 0.03 && updatedTrails.length < 10) {
                updatedTrails.push(addTrail());
            }

            return updatedTrails;
        });
    });

    return (
        <group>
            {trails.map(trail => (
                <NeonTrail
                    key={trail.id}
                    startPosition={trail.position}
                    color={trail.color}
                />
            ))}
        </group>
    );
};

export default NeonTrails;
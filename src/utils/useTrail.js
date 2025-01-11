import { useRef, useCallback } from 'react';
import * as THREE from 'three';

export const useTrail = ({
    maxLength = 50,
    dampening = 0.85,
    tension = 0.3,
    minDistance = 0.01
}) => {
    const points = useRef([]);
    const velocities = useRef([]);
    const lastPoint = useRef(new THREE.Vector3());
    const velocity = useRef(new THREE.Vector3());

    const addPoint = useCallback((point) => {
        const dist = lastPoint.current.distanceTo(point);

        if (dist < minDistance) return;

        // Calculate velocity
        velocity.current
            .copy(point)
            .sub(lastPoint.current)
            .multiplyScalar(1 / dist);

        // Add new point
        points.current.unshift(point.clone());
        velocities.current.unshift(velocity.current.clone());

        // Maintain maximum length
        if (points.current.length > maxLength) {
            points.current.pop();
            velocities.current.pop();
        }

        lastPoint.current.copy(point);
    }, [maxLength, minDistance]);

    const update = useCallback((delta) => {
        // Update all points based on their velocities
        for (let i = 0; i < points.current.length; i++) {
            const point = points.current[i];
            const vel = velocities.current[i];

            // Apply velocity with dampening
            point.add(vel.multiplyScalar(delta * tension));
            vel.multiplyScalar(dampening);

            // If not the first point, attract to previous point to maintain trail
            if (i > 0) {
                const prev = points.current[i - 1];
                const toPrev = new THREE.Vector3().subVectors(prev, point);
                const dist = toPrev.length();

                if (dist > minDistance) {
                    point.add(
                        toPrev.normalize().multiplyScalar(dist * tension * delta)
                    );
                }
            }
        }
    }, [dampening, tension, minDistance]);

    const getPoints = useCallback(() => points.current, []);

    const getVelocity = useCallback(() => {
        return velocity.current.length();
    }, []);

    return {
        addPoint,
        update,
        getPoints,
        getVelocity
    };
};
import * as THREE from "three";
import { Target } from "../entities/Target";
import { eventBus } from "../../communication/EventBus";

export function spawnRandomTarget(scene: THREE.Scene, randomRange: number = 2, minDistance: number = 1): Target {
    // Check if minDistance is less than the range
    if (minDistance > randomRange) {
        console.warn("minDistance should be less than or equal to the randomRange. Adjusting minDistance to match randomRange.");
        minDistance = randomRange;
    }

    const minDistanceSquared = minDistance * minDistance;
    // Generate 5 random position derivatives
    const initialPositionDerivatives: THREE.Vector3[] = [];
    for (let i = 0; i < 5; i++) {
        let attempts = 0;
        let positionDerivative: THREE.Vector3;

        do {
            positionDerivative = new THREE.Vector3(
                (Math.random() - 0.5) * 2 * randomRange,
                (Math.random() - 0.5) * 2 * randomRange,
                (Math.random() - 0.5) * 2 * randomRange
            );
            attempts++;
        } while (positionDerivative.lengthSq() < minDistanceSquared && attempts < 2);

        // If the position derivative is still less than minDistance after 2 attempts,
        // set each component to either +minDistance or -minDistance
        if (positionDerivative.lengthSq() < minDistanceSquared) {
            positionDerivative.set(
                Math.random() < 0.5 ? -minDistance : minDistance,
                Math.random() < 0.5 ? -minDistance : minDistance,
                Math.random() < 0.5 ? -minDistance : minDistance
            );
        }

        initialPositionDerivatives.push(positionDerivative);
    }

    const target = new Target(initialPositionDerivatives);
    target.addToScene(scene);

    // Emit an event with the target's initial position
    eventBus.emit('targetSpawned', { position: initialPositionDerivatives[0] });

    return target;
}

// export const targetSpawner = new TargetSpawner();
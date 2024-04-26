import * as THREE from "three";
import { Target } from "../entities/Target";
import { eventBus } from "../../communication/EventBus";

// A functional approach to TargetSpawner
export function createTargetSpawner() {
    function spawnRandomTarget(scene: THREE.Scene, randomRange = 2, minDistance = 1) {
        if (minDistance > randomRange) {
            console.warn("minDistance should be less than or equal to the randomRange.");
            minDistance = randomRange;
        }

        const minDistanceSquared = minDistance * minDistance;
        const targetInitialPositionDerivatives = [];

        for (let i = 0; i < 5; i++) {
            let positionDerivative;
            let attempts = 0;
            do {
                positionDerivative = new THREE.Vector3(
                    (Math.random() - 0.5) * 2 * randomRange,
                    (Math.random() - 0.5) * 2 * randomRange,
                    (Math.random() - 0.5) * 2 * randomRange
                );
                attempts++;
            } while (positionDerivative.lengthSq() < minDistanceSquared && attempts < 2);

            if (positionDerivative.lengthSq() < minDistanceSquared) {
                positionDerivative.set(
                    Math.random() < 0.5 ? -minDistance : minDistance,
                    Math.random() < 0.5 ? -minDistance : minDistance,
                    Math.random() < 0.5 ? -minDistance : minDistance
                );
            }
            targetInitialPositionDerivatives.push(positionDerivative);
        }

        const target = new Target(targetInitialPositionDerivatives, [new THREE.Vector3(0, 0, 0)]);
        target.addToScene(scene);
        eventBus.emit('targetSpawned', { position: targetInitialPositionDerivatives[0] });

        return target;
    }

    return {
        spawnRandomTarget
    };
}
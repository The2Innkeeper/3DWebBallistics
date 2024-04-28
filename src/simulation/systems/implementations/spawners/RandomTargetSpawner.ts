import * as THREE from "three";
import { Target } from "../../../entities/implementations/Target";
import { eventBus } from "../../../../communication/EventBus";
import { SpawnRandomTargetEvent } from "../../../../communication/events/entities/spawning/SpawnRandomTargetEvent";
import { TargetSpawnedEvent } from "../../../../communication/events/entities/spawning/TargetSpawnedEvent";

// A functional approach to TargetSpawner
export function createRandomTargetSpawner(scene: THREE.Scene, randomRange = 2, minDistance = 1) {
    function spawnRandomTarget(event: SpawnRandomTargetEvent) {
        const { radius, height, radialSegments, expiryLifeTime, expiryDistance } = event;

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

        const target = new Target(targetInitialPositionDerivatives, radius, height, radialSegments, expiryLifeTime, expiryDistance);
        target.addToScene(scene);
        eventBus.emit(TargetSpawnedEvent, new TargetSpawnedEvent(target));

        return target;
    }

    eventBus.subscribe(SpawnRandomTargetEvent, (event: SpawnRandomTargetEvent) => spawnRandomTarget(event));

    return {
        spawnRandomTarget: (event: SpawnRandomTargetEvent) => spawnRandomTarget(event)
    };
}
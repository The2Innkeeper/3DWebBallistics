// ProjectileSpawner.ts
import * as THREE from "three";
import { Projectile } from "../../../entities/implementations/Projectile";
import { eventBus } from "../../../../communication/EventBus";
import { SpawnProjectileEvent } from "../../../../communication/events/entities/spawning/SpawnProjectileEvent";
import { ProjectileSpawnedEvent } from "../../../../communication/events/entities/spawning/ProjectileSpawnedEvent";
import { entityManager } from "../../../systems/implementations/EntityManager";

// A functional approach to ProjectileSpawner
export function createProjectileSpawner(scene: THREE.Scene) {
    function spawnProjectile(event: SpawnProjectileEvent) {
        const { displacementDerivatives, projectileDerivatives, radius, expiryLifeTime, expiryDistance } = event;

        // Get the oldest unengaged target from the entity manager
        const target = entityManager.getOldestUnengagedTarget();

        if (target) {
            console.log("Spawning projectile with parameters:", {
                displacementDerivatives,
                projectileDerivatives,
                radius,
                expiryLifeTime,
                expiryDistance,
                target
            });

            const projectile = new Projectile(
                displacementDerivatives,
                projectileDerivatives,
                target,
                radius,
                expiryLifeTime,
                expiryDistance
            );
            projectile.addToScene(scene);
            eventBus.emit(ProjectileSpawnedEvent, new ProjectileSpawnedEvent(projectile));

            return projectile;
        } else {
            console.log("No unengaged target available. Skipping projectile spawn.");
            return null;
        }
    }

    eventBus.subscribe(SpawnProjectileEvent, spawnProjectile);

    return {
        spawnProjectile: (event: SpawnProjectileEvent) => spawnProjectile(event)
    };
}
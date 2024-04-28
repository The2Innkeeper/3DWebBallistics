// ProjectileSpawner.ts
import * as THREE from "three";
import { Projectile } from "../../entities/implementations/Projectile";
import { eventBus } from "../../../communication/EventBus";
import { SpawnProjectileEvent } from "../../../communication/events/entities/spawning/SpawnProjectileEvent";
import { ProjectileSpawnedEvent } from "../../../communication/events/entities/spawning/ProjectileSpawnedEvent";
import { entityManager } from "../../systems/EntityManager";
import { updateScaledDisplacementDerivatives } from "../../utils/MovementUtils";
import { scaledProjectileShooterDisplacementDerivatives } from "../../components/MovementComponents";

// A functional approach to ProjectileSpawner
export function createProjectileSpawner(scene: THREE.Scene) {
    function spawnProjectile(event: SpawnProjectileEvent) {
        const { targetDerivatives, shooterDerivatives, projectileDerivatives, radius, expiryLifeTime, expiryDistance } = event;

        // Get the oldest unengaged target from the entity manager
        const target = entityManager.getOldestUnengagedTarget();

        if (target) {
            // Update the backend vectors
            updateScaledDisplacementDerivatives(targetDerivatives, shooterDerivatives, projectileDerivatives);

            console.log("Spawning projectile with parameters:", {
                scaledProjectileShooterDisplacementDerivatives,
                radius,
                expiryLifeTime,
                expiryDistance,
                target
            });

            const projectile = new Projectile(
                scaledProjectileShooterDisplacementDerivatives,
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
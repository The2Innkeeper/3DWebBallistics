import { VectorType } from "src/ui/VectorControl/types/VectorType";
import * as THREE from "three";
import { eventBus } from "../../communication/EventBus";
import { Projectile } from "../entities/Projectile";

class ProjectileSpawner {
    constructor() {
        eventBus.on('spawnProjectile', this.spawnProjectile.bind(this));
    }

    public spawnProjectile(scene: THREE.Scene, projectileVectors: THREE.Vector3[]): void {
        console.log("Spawning projectile with vectors:", projectileVectors);
    }
}

let projectileSpawnerInstance: ProjectileSpawner;

export function getProjectileSpawner(): ProjectileSpawner {
    if (!projectileSpawnerInstance) {
        projectileSpawnerInstance = new ProjectileSpawner();
    }
    return projectileSpawnerInstance;
}
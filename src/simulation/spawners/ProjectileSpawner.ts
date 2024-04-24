import { VectorType } from "src/types/VectorType";
import * as THREE from "three";
import { eventBus } from "../../events/EventBus";

class ProjectileSpawner {
    constructor() {
        // Subscribe to the 'vectorsUpdated' event
        eventBus.on('vectorsUpdated', this.onVectorsUpdated.bind(this));
    }

    private onVectorsUpdated(vectorValues: Record<VectorType, THREE.Vector3[]>): void {
        // Console log the updated projectile vectors
        console.log('Updated Projectile Vectors:', vectorValues.projectile);
        // Perform any necessary actions with the updated projectile vectors
        // ...
    }

    // ...
}

export const projectileSpawner = new ProjectileSpawner();
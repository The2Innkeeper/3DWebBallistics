// Projectile.ts
import * as THREE from 'three';
import { BaseMovable } from './classes/BaseMovable';
import { IMovable } from './interfaces/IMovable';
import { checkCollision } from '../core/physics/CollisionDetection';
import { eventBus } from '../../communication/EventBus';

export class Projectile extends BaseMovable {
    target: BaseMovable;

    constructor(initialDisplacementDerivatives: THREE.Vector3[],
                projectileInitialPositionDerivatives: THREE.Vector3[],
                target: BaseMovable,
                radius: number,
                maxLifeTime?: number,
                maxDistance?: number,
            ) {
        let position = new THREE.Vector3(0, 0, 0);
        super(position, radius, maxLifeTime, maxDistance);
        this.target = target;
        this.scaledPositionDerivatives = this.computeScaledPositionDerivatives(initialDisplacementDerivatives, projectileInitialPositionDerivatives);
        this.mesh = this.createMesh();
    }

    updatePosition(deltaTime: number): void {
        this.lifeTime += deltaTime;
        if (this.isExpired()) {
            eventBus.emit('projectileExpired', this);
            return;
        }
        this.position = this.evaluatePositionAt(this.lifeTime);
        this.updateMesh();
        if (checkCollision(this, this.target)) {
            eventBus.emit('collision', { projectile: this, target: this.target });
        }
    }

    protected createMesh(): THREE.Mesh {
        const geometry = new THREE.SphereGeometry(this.radius);
        const material = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(this.position);
        return mesh;
    }

    private computeScaledPositionDerivatives(initialDisplacementDerivatives: THREE.Vector3[], projectilePositionDerivatives: THREE.Vector3[]): THREE.Vector3[] {
        const scaledPositionDerivatives: THREE.Vector3[] = [];
        let factorial = 1;
        for (let i = 0; i < initialDisplacementDerivatives.length; i++) {
            const scaledDerivative = new THREE.Vector3(
                initialDisplacementDerivatives[i].x - projectilePositionDerivatives[i].x / factorial,
                initialDisplacementDerivatives[i].y - projectilePositionDerivatives[i].y / factorial,
                initialDisplacementDerivatives[i].z - projectilePositionDerivatives[i].z / factorial,
            );
            scaledPositionDerivatives.push(scaledDerivative);
            factorial *= (i + 1);
        }
        return scaledPositionDerivatives;
    }

    registerUpdate() {
        // Ensure that deltaTime is passed to updatePosition when the 'update' event is emitted
        eventBus.on('update', (deltaTime: number) => this.updatePosition(deltaTime));
    }
}
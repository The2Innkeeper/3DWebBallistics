// Projectile.ts
import * as THREE from 'three';
import { BaseMovable } from './classes/BaseMovable';
import { checkCollision } from '../../systems/implementations/physics/CollisionDetection';
import { eventBus } from '../../../communication/EventBus';
import { ProjectileExpiredEvent } from '../../../communication/events/entities/expiry/ProjectileExpiredEvent';
import { CollisionEvent } from '../../../communication/events/entities/CollisionEvent';

export class Projectile extends BaseMovable {
    target: BaseMovable;

    constructor(displacementDerivatives: readonly THREE.Vector3[],
                projectilePositionDerivatives: readonly THREE.Vector3[],
                target: BaseMovable,
                radius: number,
                expiryLifetime?: number,
                expiryDistance?: number,
            ) {
        const scaledPositionDerivatives = Projectile.computeScaledPositionDerivatives(displacementDerivatives, projectilePositionDerivatives);
        let position = scaledPositionDerivatives[0].clone();
        super(position, radius, expiryLifetime, expiryDistance);
        this.scaledPositionDerivatives = scaledPositionDerivatives;
        this.target = target;
        this.scaledPositionDerivatives = Projectile.computeScaledPositionDerivatives(displacementDerivatives, projectilePositionDerivatives);
        this.mesh = this.createMesh();
    }

    public getTarget(): BaseMovable {
        return this.target;
    }

    updatePosition(deltaTime: number): void {
        this.lifeTime += deltaTime;
        if (this.isExpired()) {
            eventBus.emit(ProjectileExpiredEvent, this);
            return;
        }
        this.position = this.evaluatePositionAt(this.lifeTime);
        this.updateMesh();
        if (checkCollision(this, this.target)) {
            eventBus.emit(CollisionEvent, { projectile: this, target: this.target });
        }
    }

    public createMesh(): THREE.Mesh {
        const geometry = new THREE.SphereGeometry(this.radius);
        const material = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(this.position);
        return mesh;
    }

    private static computeScaledPositionDerivatives(initialDisplacementDerivatives: readonly THREE.Vector3[], projectilePositionDerivatives: readonly THREE.Vector3[]): readonly THREE.Vector3[] {
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
}
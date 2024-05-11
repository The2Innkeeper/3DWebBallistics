// Projectile.ts
import * as THREE from 'three';
import { BaseMovable } from './classes/BaseMovable';
import { checkCollision } from '../../systems/physics/CollisionDetection';
import { eventBus } from '../../../communication/EventBus';
import { ProjectileExpiredEvent } from '../../../communication/events/entities/expiry/ProjectileExpiredEvent';
import { CollisionEvent } from '../../../communication/events/entities/CollisionEvent';
import { IMovable } from '../interfaces/IMovable';

export class Projectile extends BaseMovable {
    target: IMovable;

    constructor(scaledPositionDerivatives: readonly THREE.Vector3[],
                target: IMovable,
                radius: number,
                expiryLifetime?: number,
                expiryDistance?: number,
            ) {
        let position = scaledPositionDerivatives[0].clone();
        super(position, radius, expiryLifetime, expiryDistance);
        this.scaledPositionDerivatives = scaledPositionDerivatives;
        this.target = target;
        this.mesh = this.createMesh();
    }

    public getTarget(): IMovable {
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
}
// Projectile.ts
import * as THREE from 'three';
import { BaseMovable } from './classes/BaseMovable';
import { IMovable } from './interfaces/IMovable';
import { checkCollision } from '../core/physics/CollisionDetection';
import { eventBus } from '../../communication/EventBus';

export class Projectile extends BaseMovable {
    target: BaseMovable;

    constructor(targetInitialPositionDerivatives: THREE.Vector3[],
                shooterInitialPositionDerivatives: THREE.Vector3[],
                target: BaseMovable,
                radius: number,
                maxLifeTime?: number,
                maxDistance?: number,
            ) {
        let position = targetInitialPositionDerivatives[0].clone();
        super(position, radius, maxLifeTime, maxDistance);
        this.target = target;
        this.scaledPositionDerivatives = this.computeScaledPositionDerivatives(targetInitialPositionDerivatives, shooterInitialPositionDerivatives);
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

    private computeScaledPositionDerivatives(targetPositionDerivatives: THREE.Vector3[], shooterPositionDerivatives: THREE.Vector3[]): THREE.Vector3[] {
        const scaledPositionDerivatives: THREE.Vector3[] = [];
        let factorial = 1;
        for (let i = 0; i < targetPositionDerivatives.length; i++) {
            const scaledDerivative = new THREE.Vector3(
                targetPositionDerivatives[i].x - shooterPositionDerivatives[i].x / factorial,
                targetPositionDerivatives[i].y - shooterPositionDerivatives[i].y / factorial,
                targetPositionDerivatives[i].z - shooterPositionDerivatives[i].z / factorial,
            );
            scaledPositionDerivatives.push(scaledDerivative);
            factorial *= (i + 1);
        }
        return scaledPositionDerivatives;
    }

    registerUpdate() {
        eventBus.on('update', this.updatePosition.bind(this));
    }
}
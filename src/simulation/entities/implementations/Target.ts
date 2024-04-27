import * as THREE from 'three';
import { BaseMovable } from './classes/BaseMovable';
import { eventBus } from '../../../communication/EventBus';
import { TargetExpiredEvent } from '../../../communication/events/entities/expiry/TargetExpiredEvent';
import { FrameUpdateEvent } from '../../../communication/events/FrameUpdateEvent';

export class Target extends BaseMovable {
    height: number;
    radialSegments: number;

    constructor(
        initialDisplacementDerivatives: readonly THREE.Vector3[],
        radius: number = 0.875, 
        height: number = 0.25, 
        radialSegments: number = 32, 
        expiryLifeTime: number = 20, 
        expiryDistance: number = 1000, 
            ) {
        let position = initialDisplacementDerivatives[0].clone();
        super(position, radius, expiryLifeTime, expiryDistance);
        this.height = height;
        this.radialSegments = radialSegments;
        this.mesh = this.createMesh();
        this.scaledPositionDerivatives = this.computeScaledPositionDerivatives(initialDisplacementDerivatives);
        this.orientTowardsShooterAtOrigin();
    }

    updatePosition(deltaTime: number): void {
        this.lifeTime += deltaTime;
        this.position = this.evaluatePositionAt(this.lifeTime);
        this.updateMesh();

        if (this.isExpired()) {
            eventBus.emit(TargetExpiredEvent, this);
            return;
        }

        this.orientTowardsShooterAtOrigin();
    }

    private orientTowardsShooterAtOrigin(): void {
        const origin = new THREE.Vector3(0, 0, 0);
        const direction = new THREE.Vector3().subVectors(origin, this.position).normalize();
        this.mesh.lookAt(direction);
    }

    public createMesh(): THREE.Mesh {
        const geometry = new THREE.CylinderGeometry(this.radius, this.radius, this.height, this.radialSegments);
        geometry.rotateX(Math.PI / 2); // Orient the cylinder to stand upright
        const material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(this.position);
        return mesh;
    }

    private computeScaledPositionDerivatives(initialDisplacementDerivatives: readonly THREE.Vector3[]): readonly THREE.Vector3[] {
        const scaledPositionDerivatives: THREE.Vector3[] = [];
        let factorial = 1;

        for (let i = 0; i < initialDisplacementDerivatives.length; i++) {
            // Compute the scaled derivative
            const scaledDerivative = initialDisplacementDerivatives[i].clone().divideScalar(factorial);

            scaledPositionDerivatives.push(scaledDerivative);
            factorial *= (i + 1);
        }

        return scaledPositionDerivatives;
    }
}
import * as THREE from 'three';
import { BaseMovable } from './classes/BaseMovable';
import { eventBus } from '../../communication/EventBus';

export class Target extends BaseMovable {
    height: number;
    radialSegments: number;

    constructor(targetInitialPositionDerivatives: THREE.Vector3[],
                shooterInitialPositionDerivatives: THREE.Vector3[], 
                radius: number = 0.875, 
                height: number = 0.25, 
                radialSegments: number = 32, 
                maxLifeTime: number = 20, 
                maxDistance: number = 1000, 
            ) {
        let position = targetInitialPositionDerivatives[0].clone();
        super(position, radius, maxLifeTime, maxDistance);
        this.height = height;
        this.radialSegments = radialSegments;
        this.mesh = this.createMesh();
        this.scaledPositionDerivatives = this.computeScaledPositionDerivatives(targetInitialPositionDerivatives, shooterInitialPositionDerivatives);
        this.orientTowardsShooterAtOrigin();
    }

    updatePosition(deltaTime: number): void {
        this.lifeTime += deltaTime;
        this.position = this.evaluatePositionAt(this.lifeTime);
        this.updateMesh();

        if (this.isExpired()) {
            eventBus.emit('targetExpired', this);
            return;
        }

        this.orientTowardsShooterAtOrigin();
    }

    private orientTowardsShooterAtOrigin(): void {
        const origin = new THREE.Vector3(0, 0, 0);
        const direction = new THREE.Vector3().subVectors(origin, this.position).normalize();
        this.mesh.lookAt(direction);
    }

    protected createMesh(): THREE.Mesh {
        const geometry = new THREE.CylinderGeometry(this.radius, this.radius, this.height, this.radialSegments);
        geometry.rotateX(Math.PI / 2); // Orient the cylinder to stand upright
        const material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(this.position);
        return mesh;
    }

    protected computeScaledPositionDerivatives(targetPositionDerivatives: THREE.Vector3[], shooterPositionDerivatives: THREE.Vector3[]): THREE.Vector3[] {
        const maxLength = Math.max(targetPositionDerivatives.length, shooterPositionDerivatives.length);
        const scaledPositionDerivatives: THREE.Vector3[] = [];
        let factorial = 1;

        for (let i = 0; i < maxLength; i++) {
            // Determine the components to use for calculations directly
            const targetX = i < targetPositionDerivatives.length ? targetPositionDerivatives[i].x : 0;
            const targetY = i < targetPositionDerivatives.length ? targetPositionDerivatives[i].y : 0;
            const targetZ = i < targetPositionDerivatives.length ? targetPositionDerivatives[i].z : 0;
            const shooterX = i < shooterPositionDerivatives.length ? shooterPositionDerivatives[i].x : 0;
            const shooterY = i < shooterPositionDerivatives.length ? shooterPositionDerivatives[i].y : 0;
            const shooterZ = i < shooterPositionDerivatives.length ? shooterPositionDerivatives[i].z : 0;

            // Compute the scaled derivative without creating a new zero vector
            const scaledDerivative = new THREE.Vector3(
                (targetX - shooterX) / factorial,
                (targetY - shooterY) / factorial,
                (targetZ - shooterZ) / factorial
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
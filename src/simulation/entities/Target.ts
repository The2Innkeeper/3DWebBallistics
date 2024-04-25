import * as THREE from 'three';
import { BaseMovable } from './classes/BaseMovable';
import { eventBus } from '../../communication/EventBus';

export class Target extends BaseMovable {
    height: number;
    radialSegments: number;

    constructor(initialPositionDerivatives: THREE.Vector3[], 
                radius: number = 0.875, 
                height: number = 0.25, 
                radialSegments: number = 32, 
                maxLifeTime: number = 20, 
                maxDistance: number = 1000, 
            ) {
        let position = initialPositionDerivatives[0].clone();
        super(position, radius, maxLifeTime, maxDistance);
        this.height = height;
        this.radialSegments = radialSegments;
        this.mesh = this.createMesh();
        this.scaledPositionDerivatives = this.computeScaledPositionDerivatives(initialPositionDerivatives);
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

    protected computeScaledPositionDerivatives(initialPositionDerivatives: THREE.Vector3[]): THREE.Vector3[] {
        const scaledPositionDerivatives: THREE.Vector3[] = [];
        let factorial = 1;
        for (let i = 0; i < initialPositionDerivatives.length; i++) {
            const scaledDerivative = new THREE.Vector3(
                initialPositionDerivatives[i].x / factorial,
                initialPositionDerivatives[i].y / factorial,
                initialPositionDerivatives[i].z / factorial
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
import * as THREE from 'three';
import { IMovable } from '../interfaces/IMovable';
import { eventBus } from '../../../communication/EventBus';

export abstract class BaseMovable implements IMovable {
    lifeTime: number = 0;
    position: THREE.Vector3;
    radius: number;
    maxLifeTime: number;
    maxDistance: number;

    protected scaledPositionDerivatives!: THREE.Vector3[];
    protected mesh!: THREE.Mesh;

    constructor(position: THREE.Vector3, radius: number, maxLifeTime: number = 20, maxDistance: number = 1000) {
        this.position = position;
        this.radius = radius;
        this.maxLifeTime = maxLifeTime;
        this.maxDistance = maxDistance;
        // Initialize scaled position derivatives in inherited classes
        // Initialize mesh in inherited classes
    }

    abstract updatePosition(deltaTime: number): void;

    isExpired(): boolean {
        return this.lifeTime > this.maxLifeTime || this.position.lengthSq() > this.maxDistance ** 2;
    }

    protected evaluatePositionAt(time: number): THREE.Vector3 {
        let position = new THREE.Vector3(0, 0, 0);
        for (let i = this.scaledPositionDerivatives.length - 1; i >= 0; i--) {
            position.multiplyScalar(time).add(this.scaledPositionDerivatives[i]);
        }
        return position;
    }

    public getScaledPositionDerivatives(): THREE.Vector3[] {
        return this.scaledPositionDerivatives;
    }

    updateMesh(): void {
        this.mesh.position.copy(this.position);
    }

    addToScene(scene: THREE.Scene): void {
        scene.add(this.mesh);
    }

    removeFromScene(scene: THREE.Scene): void {
        scene.remove(this.mesh);
    }
}
import * as THREE from 'three';
import { eventBus } from '../../../../communication/EventBus';
import { IRenderable } from '../../interfaces/IRenderable';
import { FrameUpdateEvent } from '../../../../communication/events/FrameUpdateEvent';

export abstract class Entity implements IRenderable {
    public mesh!: THREE.Mesh;
    position: THREE.Vector3;
    readonly radius: number;

    constructor(position: THREE.Vector3, radius: number) {
        this.position = position;
        this.radius = radius;
        // Initialize scaled position derivatives in inherited classes
        // Initialize mesh in inherited classes
    }

    abstract createMesh(): void;

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
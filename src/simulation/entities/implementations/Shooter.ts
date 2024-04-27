import { eventBus } from '../../../communication/EventBus';
import * as THREE from 'three';
import { IRenderable } from '../interfaces/IRenderable';
import { ProjectileSpawnedEvent } from '../../../communication/events/entities/spawning/ProjectileSpawnedEvent';

export class Shooter implements IRenderable {
    position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    radius: number;
    height: number;
    public mesh: THREE.Mesh;
    constructor(radius: number = 0.625, height: number = 2) {
        this.radius = radius;
        this.height = height;
        this.mesh = this.createMesh();
        this.registerUpdate();
    }

    createMesh(): THREE.Mesh {
        const radialSegments = 32;
        const geometry = new THREE.CylinderGeometry(this.radius, this.radius, this.height, radialSegments);
        const DARK_GRAY = 0x555555;
        const material = new THREE.MeshPhongMaterial({ color: DARK_GRAY });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, this.height / 2 - this.radius, 0);
        return mesh;
    }

    updateMesh(): void {
        // Update the mesh position based on the shooter's position
        this.mesh.position.copy(this.position);
    }

    // Method to add the target to a scene
    addToScene(scene: THREE.Scene): void {
        scene.add(this.mesh);
    }

    // Method to remove the target from a scene
    removeFromScene(scene: THREE.Scene): void {
        scene.remove(this.mesh);
    }

    orientToProjectileVelocity(data: { initialProjectileVelocity: THREE.Vector3 }): void {
        const direction = data.initialProjectileVelocity.clone().normalize();
        this.mesh.lookAt(direction);
    }

    registerUpdate() {
        eventBus.subscribe(ProjectileSpawnedEvent, this.orientToProjectileVelocity.bind(this));
    }
}
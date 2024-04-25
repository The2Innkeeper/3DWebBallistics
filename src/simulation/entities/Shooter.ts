import { eventBus } from '../../communication/EventBus';
import * as THREE from 'three';

export class Shooter {
    position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    radius: number;
    height: number;
    private mesh: THREE.Mesh;
    constructor(radius: number = 0.625, height: number = 2, radialSegments: number = 32) {
        this.radius = radius;
        this.height = height;
        this.mesh = this.createMesh(radius, height, radialSegments);
    }

    createMesh(radius: number = 0.625, height: number = 2, radialSegments: number = 32): THREE.Mesh {
        // Cylinder Geometry for Shooter
        const geometry = new THREE.CylinderGeometry(radius, radius, height, radialSegments);
        const DARK_GRAY = 0x555555;
        const material = new THREE.MeshPhongMaterial({ color: DARK_GRAY });
        let mesh = new THREE.Mesh(geometry, material);

        // Initialize base position at origin shifted down by radius
        mesh.position.set(0, height / 2 - radius, 0);

        return mesh;
    }

    // Method to add the target to a scene
    addToScene(scene: THREE.Scene): void {
        scene.add(this.mesh);
    }

    // Method to remove the target from a scene
    removeFromScene(scene: THREE.Scene): void {
        scene.remove(this.mesh);
    }

    faceTarget(data: { position: THREE.Vector3 }): void {
        const direction = new THREE.Vector3().subVectors(data.position, this.position).normalize();
        this.mesh.lookAt(direction);
    }

    registerUpdate() {
        eventBus.on('targetSpawned', this.faceTarget.bind(this));
    }
}
import * as THREE from 'three';
import { eventBus } from '../../../communication/EventBus';
import { ProjectileSpawnedEvent } from '../../../communication/events/entities/spawning/ProjectileSpawnedEvent';
import { Entity } from './classes/Entity';

export class Shooter extends Entity {
    height: number;
    public mesh: THREE.Mesh;
    
    constructor(position: THREE.Vector3 = new THREE.Vector3(0, 0, 0), radius: number = 0.625, height: number = 2) {
        super(position, radius);
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

    orientToProjectileVelocity(event: ProjectileSpawnedEvent): void {
        const direction = event.projectile.getScaledPositionDerivatives()[1].clone().normalize();
        this.mesh.lookAt(direction); // This makes the side face the projectile
        this.mesh.rotation.x -= Math.PI / 2; // But we want the top face like a cannon
    }
    
    registerUpdate() {
        eventBus.subscribe(ProjectileSpawnedEvent, this.orientToProjectileVelocity.bind(this));
    }
}
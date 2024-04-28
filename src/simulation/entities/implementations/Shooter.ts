import { eventBus } from '../../../communication/EventBus';
import * as THREE from 'three';
import { ProjectileSpawnedEvent } from '../../../communication/events/entities/spawning/ProjectileSpawnedEvent';
import { Entity } from './classes/Entity';
import { FrameUpdateEvent } from '../../../communication/events/FrameUpdateEvent';

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

    orientToProjectileVelocity(data: { initialProjectileVelocity: THREE.Vector3 }): void {
        const direction = data.initialProjectileVelocity.clone().normalize();
        this.mesh.lookAt(direction);
    }

    private onFrameUpdate(event: FrameUpdateEvent) {
        const deltaTime = event.deltaTime;
        this.updateMesh();
    }

    registerUpdate() {
        eventBus.subscribe(ProjectileSpawnedEvent, this.orientToProjectileVelocity.bind(this));
    }
}
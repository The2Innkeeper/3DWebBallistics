import * as THREE from 'three';

// IMovable.ts - A base interface for any movable object in the simulation
export interface IMovable {
    position: THREE.Vector3;
    updatePosition(deltaTime: number): void;
}
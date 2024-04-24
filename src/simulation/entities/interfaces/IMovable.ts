import * as THREE from 'three';

export interface IMovable {
    position: THREE.Vector3;
    radius: number;
    lifeTime: number;
    updatePosition(deltaTime: number): void;
    maxLifeTime: number;
    maxDistance: number;
    isExpired(): boolean;
}
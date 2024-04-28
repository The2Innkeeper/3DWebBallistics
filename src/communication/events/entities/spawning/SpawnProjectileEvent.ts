import { IMovable } from 'src/simulation/entities/interfaces/IMovable';
import * as THREE from 'three';

export class SpawnProjectileEvent {
    constructor(
        public readonly targetDerivatives: THREE.Vector3[],
        public readonly shooterDerivatives: THREE.Vector3[],
        public readonly projectileDerivatives: THREE.Vector3[],
        public readonly target: IMovable,
        public readonly radius: number = 0.625,
        public readonly expiryLifeTime: number = 20,
        public readonly expiryDistance: number = 1000,
    ) {}
}
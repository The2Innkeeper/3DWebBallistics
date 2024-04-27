import { IMovable } from 'src/simulation/entities/interfaces/IMovable';
import * as THREE from 'three';

export class SpawnProjectileEvent {
    constructor(
        public readonly displacementDerivatives: readonly THREE.Vector3[],
        public readonly projectileDerivatives: readonly THREE.Vector3[],
        public readonly target: IMovable,
        public readonly radius: number = 0.625,
        public readonly maxLifeTime: number = 20,
        public readonly maxDistance: number = 1000,
    ) {}
}
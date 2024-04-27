import * as THREE from 'three';

export class SpawnTargetEvent {
    constructor(
        public readonly initialDisplacementDerivatives: readonly THREE.Vector3[],
        public readonly radius: number = 0.875, 
        public readonly height: number = 0.25, 
        public readonly radialSegments: number = 32, 
        public readonly maxLifeTime: number = 20, 
        public readonly maxDistance: number = 1000, 
    ) {}
}
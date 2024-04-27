import * as THREE from 'three';

export class VectorsUpdatedEvent {
    constructor(
        public targetDerivatives: THREE.Vector3[],
        public shooterDerivatives: THREE.Vector3[],
        public projectileDerivatives: THREE.Vector3[],
    ) {}
}
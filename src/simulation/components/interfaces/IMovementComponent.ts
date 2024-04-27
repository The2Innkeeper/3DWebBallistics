import * as THREE from 'three';

export interface IMovementComponent {
    positionDerivatives: THREE.Vector3[];
}
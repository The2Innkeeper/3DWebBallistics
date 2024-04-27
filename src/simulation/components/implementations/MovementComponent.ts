// MovementComponent.ts
import * as THREE from 'three';
import { IMovementComponent } from '../interfaces/IMovementComponent';

export class MovementComponent implements IMovementComponent{
    public positionDerivatives: THREE.Vector3[];

    constructor(positionDerivatives: THREE.Vector3[] = []) {
        this.positionDerivatives = positionDerivatives;
    }
}
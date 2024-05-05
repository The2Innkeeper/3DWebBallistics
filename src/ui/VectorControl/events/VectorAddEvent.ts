// events/VectorAddEvent.ts
import { VectorType } from '../types/VectorType';
import * as THREE from 'three';

export class VectorAddEvent {
    constructor(
        public vectorType: VectorType,
        public vector: THREE.Vector3
    ) {}
}
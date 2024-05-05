// VectorUpdateEvent.ts
import { VectorType } from '../types/VectorType';
import * as THREE from 'three';

export class VectorUpdateEvent {
    constructor(
        public vectorType: VectorType,
        public vectors: THREE.Vector3[]
    ) {}
}
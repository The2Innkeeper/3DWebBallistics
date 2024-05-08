// VectorUpdateEvent.ts
import { UIVectorType } from '../types/VectorType';
import * as THREE from 'three';

export class VectorUpdateEvent {
    constructor(
        public vectorType: UIVectorType,
        public vectors: THREE.Vector3[]
    ) {}
}
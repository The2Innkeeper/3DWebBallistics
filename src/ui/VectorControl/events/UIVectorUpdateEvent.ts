// VectorUpdateEvent.ts
import { UIVectorType } from '../types/VectorType';
import * as THREE from 'three';

export class UIVectorUpdateEvent {
    constructor(
        public vectorType: UIVectorType,
        public vectors: THREE.Vector3[]
    ) {}
}
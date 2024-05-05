import { UIVectorControl } from './UIVectorControl';
import { VectorType } from './types/VectorType';
import * as THREE from 'three';

export class UIVectorControlFactory {
    static createVectorControl(type: VectorType, randomCount: number = 3, randomRange: number = 1, readOnlyIndices?: number[], shooterPosition?: THREE.Vector3): UIVectorControl {
        const elementId = `${type}Vectors`;
        const label = `${type.charAt(0).toUpperCase() + type.slice(1)} Vectors`;

        return new UIVectorControl(
            document.getElementById(elementId)!,
            type,
            label,
            randomCount,
            randomRange,
            readOnlyIndices,
            shooterPosition,
        );
    }
}
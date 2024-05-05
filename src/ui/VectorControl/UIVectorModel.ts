import * as THREE from 'three';
import { createRandomVector } from './utils/VectorUtils';
import { eventBus } from '../../communication/EventBus';
import { VectorUpdateEvent } from './events/VectorUpdateEvent';
import { VectorType, VectorTypes } from './types/VectorType';

export class UIVectorModel {
    private vectors: THREE.Vector3[] = [];

    constructor(
        private vectorType: VectorType, 
        private randomCount: number = 3,
        private randomRange: number = 1, 
        private shooterPosition?: THREE.Vector3
    ) {
        this.initializeVectors();
    }

    private initializeVectors(): void {
        for (let i = 0; i < this.randomCount; i++) {
            if (this.vectorType === VectorTypes.Projectile && this.shooterPosition && i === 0) {
                // Directly assign the reference for the first vector of the projectile
                this.vectors[i] = this.shooterPosition;
            } else {
                // Otherwise, create a random vector
                this.vectors[i] = createRandomVector(-this.randomRange, this.randomRange);
            }
        }
    }

    public getVectors(): THREE.Vector3[] {
        return this.vectors;
    }

    public addZeroVector(): void {
        this.vectors.push(new THREE.Vector3(0, 0, 0));
        this.notifyVectorUpdate();
    }

    public addRandomVector(): void {
        this.vectors.push(createRandomVector(-this.randomRange, this.randomRange));
        this.notifyVectorUpdate();
    }

    public removeVector(index: number): void {
        this.vectors.splice(index, 1);
        this.notifyVectorUpdate();
    }

    public updateVector(index: number, component: 'x' | 'y' | 'z', value: number): void {
        if (!Number.isNaN(value)) {
            this.vectors[index][component] = value;
            this.notifyVectorUpdate();
        }
    }

    public randomizeAllVectors(): void {
        this.vectors.forEach((vector, index) => {
            vector.copy(createRandomVector(-this.randomRange, this.randomRange));
            this.notifyVectorUpdate();
        });
    }

    public clearAllVectors(): void {
        this.vectors.map(vector => vector.set(0, 0, 0));
    }

    private notifyVectorUpdate(): void {
        eventBus.emit(VectorUpdateEvent, new VectorUpdateEvent(this.vectorType, this.vectors));
    }
}
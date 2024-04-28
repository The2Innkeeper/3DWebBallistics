// VectorValues.ts
import * as THREE from 'three';

export class VectorValues {
    constructor(private vectors: THREE.Vector3[] = []) {}

    createRandomVector(min: number = -1, max: number = 1): THREE.Vector3 {
        const randomX = Math.random() * (max - min) + min;
        const randomY = Math.random() * (max - min) + min;
        const randomZ = Math.random() * (max - min) + min;
        return new THREE.Vector3(randomX, randomY, randomZ);
    }

    initializeVectors(count: number): void {
        for (let i = 0; i < count; i++) {
            this.vectors.push(this.createRandomVector(-5, 5));
        }
    }

    updateVector(index: number, component: 'x' | 'y' | 'z', value: number): void {
        if (!Number.isNaN(value)) {
            this.vectors[index][component] = value;
        }
    }

    addZeroVector(): void {
        this.vectors.push(new THREE.Vector3(0, 0, 0));
    }

    addRandomVector(): void {
        this.vectors.push(this.createRandomVector(-1, 1));
    }

    removeVector(index: number): void {
        this.vectors.splice(index, 1);
    }

    clearAllVectors(): void {
        this.vectors = this.vectors.map(() => new THREE.Vector3(0, 0, 0));
    }

    randomizeAllVectors(): void {
        this.vectors = this.vectors.map(() => this.createRandomVector(-1, 1));
    }

    getVectorValues(): THREE.Vector3[] {
        return this.vectors;
    }
}
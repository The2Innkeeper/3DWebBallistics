import * as THREE from 'three';
import { createRandomVector } from '../utils/VectorUtils';
import { VectorControlRenderer } from './VectorControlRenderer';
import { VectorControlEventHandler } from './VectorControlEventHandler';
import { vectorControlManager } from './VectorControlManager';

export class VectorControl {
    private vectors: THREE.Vector3[] = [];
    private container: HTMLElement;
    public readOnlyIndex: number | null;
    private vectorType: 'shooter' | 'projectile' | 'target';
    private renderer: VectorControlRenderer;
    private vectorControlEventHandler: VectorControlEventHandler;

    constructor(containerId: string, vectorType: 'shooter' | 'projectile' | 'target', private label: string, randomCount: number = 0, readOnlyIndex: number | null = null) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container with id "${containerId}" not found.`);
        }
        this.container = container;
        this.readOnlyIndex = readOnlyIndex;
        this.vectorType = vectorType;
        this.renderer = new VectorControlRenderer(this.container, this.label, this.vectors, this.vectorType, this.readOnlyIndex);
        this.vectorControlEventHandler = new VectorControlEventHandler(this);
        this.initializeVectors(randomCount);
        this.render();
    }

    public getContainer(): HTMLElement {
        return this.container;
    }

    private initializeVectors(count: number): void {
        for (let i = 0; i < count; i++) {
            this.vectors.push(createRandomVector(-5, 5));
        }
        if (this.readOnlyIndex !== null) {
            this.makeReadOnly(this.readOnlyIndex);
        }
    }

    public render(): void {
        this.renderer.render();
        this.vectorControlEventHandler.attachEventListeners();  // Re-bind event listeners after rendering
    }

    addZeroVector(): void {
        this.vectors.push(new THREE.Vector3(0, 0, 0));
        this.notifyVectorUpdate();
        this.render();
    }

    addRandomVector(): void {
        this.vectors.push(createRandomVector(-1, 1));
        this.notifyVectorUpdate();
        this.render();
    }

    removeVector(index: number): void {
        console.log(`Removing vector at index ${index}`);
        this.vectors.splice(index, 1);
        this.notifyVectorUpdate();
        this.render();
    }

    updateVector(index: number, component: 'x' | 'y' | 'z', value: number): void {
        if (!Number.isNaN(value)) {
            this.vectors[index][component] = value;
            this.notifyVectorUpdate();
        }
        this.render();
    }

    clearAllVectors(): void {
        this.vectors = this.vectors.map(() => new THREE.Vector3(0, 0, 0));
        this.notifyVectorUpdate();
        this.render();
    }

    randomizeAllVectors(): void {
        this.vectors = this.vectors.map(() => createRandomVector(-1, 1));
        this.notifyVectorUpdate();
        this.render();
    }

    private notifyVectorUpdate(): void {
        vectorControlManager.updateVectorValues(this.vectorType, this.vectors);
    }

    makeReadOnly(index: number): void {
        this.renderer.makeReadOnly(index);
    }

    hide(): void {
        this.container.style.display = 'none';
    }

    show(): void {
        this.container.style.display = 'block';
    }

    public getVectorValues(): THREE.Vector3[] {
        return this.vectors;
    }
}
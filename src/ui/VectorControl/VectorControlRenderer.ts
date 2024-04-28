import * as THREE from 'three';
import { vectorControlManager } from './VectorControlManager';

export class VectorControlRenderer {
    constructor(
        private container: HTMLElement,
        private label: string,
        private vectors: THREE.Vector3[],
        private vectorType: 'shooter' | 'projectile' | 'target',
        private readOnlyIndex: number | null,
    ) {}

    public render(): void {
        this.container.innerHTML = `<h3>${this.label} Position Derivatives</h3>`;
        this.renderTopButtons();
        this.renderVectorsList();
        this.renderBottomButtons();
    }

    private renderTopButtons(): void {
        const clearAllButton = this.createButton('Clear All Vectors', () => this.clearAllVectors());
        const randomizeAllButton = this.createButton('Randomize All Vectors', () => this.randomizeAllVectors());

        this.container.appendChild(clearAllButton);
        this.container.appendChild(randomizeAllButton);
    }

    private renderBottomButtons(): void {
        const addZeroButton = this.createButton('Add Zero Vector', () => this.addZeroVector());
        const addRandomButton = this.createButton('Add Random Vector', () => this.addRandomVector());

        this.container.appendChild(addZeroButton);
        this.container.appendChild(addRandomButton);
    }

    private createButton(label: string, onClick: () => void): HTMLButtonElement {
        const button = document.createElement('button');
        button.textContent = label;
        button.onclick = onClick;
        return button;
    }

    private renderVectorsList(): void {
        const vectorsList = document.createElement('div');

        this.vectors.forEach((vector, index) => {
            const vectorElement = this.createVectorElement(vector, index);
            vectorsList.appendChild(vectorElement);
        });

        this.container.appendChild(vectorsList);
    }

    private createVectorElement(vector: THREE.Vector3, index: number): HTMLDivElement {
        const vectorElement = document.createElement('div');
        vectorElement.className = 'vector-controls';
        const readOnly = this.vectorType === 'projectile' && index === this.readOnlyIndex;
        const removeDisabled = this.readOnlyIndex !== null && index < this.readOnlyIndex || index === 0;
        const buttonDisabledAttribute = readOnly || removeDisabled ? ' disabled' : '';
        const buttonClass = readOnly || removeDisabled ? 'button-disabled' : '';

        vectorElement.innerHTML = `
            <label>Order ${index} position derivative: </label>
            <input type="number" value="${vector.x.toFixed(2)}" step="0.01" data-index="${index}" data-component="x" ${readOnly ? 'readonly' : ''}>
            <input type="number" value="${vector.y.toFixed(2)}" step="0.01" data-index="${index}" data-component="y" ${readOnly ? 'readonly' : ''}>
            <input type="number" value="${vector.z.toFixed(2)}" step="0.01" data-index="${index}" data-component="z" ${readOnly ? 'readonly' : ''}>
            <button class="${buttonClass}" data-index="${index}"${buttonDisabledAttribute}>Remove</button>
        `;

        return vectorElement;
    }

    makeReadOnly(index: number): void {
        const vectorElements = this.container.getElementsByClassName('vector-controls');
        if (vectorElements[index]) {
            const inputs = vectorElements[index].getElementsByTagName('input');
            for (let input of inputs) {
                input.readOnly = true;
            }
            const buttons = vectorElements[index].getElementsByTagName('button');
            for (let button of buttons) {
                button.disabled = true;
            }
        }
    }

    private clearAllVectors(): void {
        this.vectors.forEach((_, index) => {
            this.vectors[index].set(0, 0, 0);
        });
        this.render();
    }

    private randomizeAllVectors(): void {
        this.vectors.forEach((_, index) => {
            this.setRandomVectors(this.vectors[index]);
        });
        this.render();
    }

    private setRandomVectors(vector: THREE.Vector3): void {
        const randomX = Math.random() * 2 - 1;
        const randomY = Math.random() * 2 - 1;
        const randomZ = Math.random() * 2 - 1;
        vector.set(randomX, randomY, randomZ);
    }

    private addZeroVector(): void {
        this.vectors.push(new THREE.Vector3(0, 0, 0));
        this.render();
        vectorControlManager.updateBackendValues();
    }

    private addRandomVector(): void {
        const newVector = new THREE.Vector3();
        this.setRandomVectors(newVector);
        this.vectors.push(newVector);
        this.render();
        vectorControlManager.updateBackendValues();
    }
}
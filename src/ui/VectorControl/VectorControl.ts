import * as THREE from 'three';
import { vectorControlManager } from './VectorControlManager';

class VectorControl {
    private vectors: THREE.Vector3[] = [];
    private container: HTMLElement;
    public readOnlyIndex: number | null;
    private vectorType: 'shooter' | 'projectile' | 'target';

    constructor(containerId: string, vectorType: 'shooter' | 'projectile' | 'target', private label: string, randomCount: number = 0, readOnlyIndex: number | null = null) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container with id "${containerId}" not found.`);
        }
        this.container = container;
        this.readOnlyIndex = readOnlyIndex;
        this.initializeVectors(randomCount);
        this.render();
        this.vectorType = vectorType;
    }

    private createRandomVector(min: number = -1, max: number = 1): THREE.Vector3 {
        const randomX = Math.random() * (max - min) + min;
        const randomY = Math.random() * (max - min) + min;
        const randomZ = Math.random() * (max - min) + min;
        return new THREE.Vector3(randomX, randomY, randomZ);
    }

    private initializeVectors(count: number): void {
        for (let i = 0; i < count; i++) {
            this.vectors.push(this.createRandomVector(-5, 5));
        }
        if (this.readOnlyIndex !== null) {
            this.makeReadOnly(this.readOnlyIndex);
        }
    }

    public render(): void {
        this.container.innerHTML = `<h3>${this.label} Position Derivatives</h3>`;

        // Clear all vectors button
        const clearAllButton = document.createElement('button');
        clearAllButton.textContent = 'Clear All Vectors';
        clearAllButton.onclick = () => this.clearAllVectors();
        this.container.appendChild(clearAllButton);

        // Randomize all vectors button
        const randomizeAllButton = document.createElement('button');
        randomizeAllButton.textContent = 'Randomize All Vectors';
        randomizeAllButton.onclick = () => this.randomizeAllVectors();
        this.container.appendChild(randomizeAllButton);
        
        const vectorsList = document.createElement('div');

        this.vectors.forEach((vector, index) => {
            const vectorElement = document.createElement('div');
            vectorElement.className = 'vector-controls';
            const readOnly = this.vectorType === 'projectile' && index === this.readOnlyIndex;
            const removeDisabled = this.readOnlyIndex !== null && index < this.readOnlyIndex
                                || index === 0;
            const buttonDisabledAttribute = readOnly || removeDisabled ? ' disabled' : '';
            const buttonClass = readOnly || removeDisabled ? 'button-disabled' : '';
            
            vectorElement.innerHTML = `
                <label>Order ${index} position derivative: </label>
                <input type="number" value="${vector.x.toFixed(2)}" step="0.01" data-index="${index}" data-component="x" ${readOnly ? 'readonly' : ''}>
                <input type="number" value="${vector.y.toFixed(2)}" step="0.01" data-index="${index}" data-component="y" ${readOnly ? 'readonly' : ''}>
                <input type="number" value="${vector.z.toFixed(2)}" step="0.01" data-index="${index}" data-component="z" ${readOnly ? 'readonly' : ''}>
                <button class="${buttonClass}" data-index="${index}"${buttonDisabledAttribute}>Remove</button>
            `;
            vectorsList.appendChild(vectorElement);
        });
        this.container.appendChild(vectorsList);
        
        vectorsList.querySelectorAll('input[type=number]').forEach(input => {
            input.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                const index = parseInt(target.dataset.index!, 10);
                const component = target.dataset.component as 'x' | 'y' | 'z';
                const value = parseFloat(target.value);
                this.updateVector(index, component, value);
            });
        });

        vectorsList.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(button.dataset.index!, 10);
                this.removeVector(index);
            });
        });

        const addZeroButton = document.createElement('button');
        addZeroButton.textContent = 'Add Zero Vector';
        addZeroButton.onclick = () => this.addZeroVector();
        this.container.appendChild(addZeroButton);

        const addRandomButton = document.createElement('button');
        addRandomButton.textContent = 'Add Random Vector';
        addRandomButton.onclick = () => this.addRandomVector();
        this.container.appendChild(addRandomButton);
    }

    addZeroVector(): void {
        this.vectors.push(new THREE.Vector3(0, 0, 0));
        this.render();
    }

    addRandomVector(): void {
        this.vectors.push(this.createRandomVector(-1, 1));
        this.render();
    }

    removeVector(index: number): void {
        this.vectors.splice(index, 1);
        this.render();
    }

    updateVector(index: number, component: 'x' | 'y' | 'z', value: number): void {
        if (!Number.isNaN(value)) {
            this.vectors[index][component] = value;
            // Notify the VectorControlManager about the vector update
            vectorControlManager.notifyVectorUpdate();
        }
        this.render();
    }
    
    clearAllVectors(): void {
        this.vectors = this.vectors.map(() => new THREE.Vector3(0, 0, 0));
        this.render();
    }

    randomizeAllVectors(): void {
        this.vectors = this.vectors.map(() => this.createRandomVector(-1, 1));
        this.render();
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

export default VectorControl;
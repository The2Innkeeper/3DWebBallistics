import * as THREE from 'three';

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

    private initializeVectors(count: number): void {
        for (let i = 0; i < count; i++) {
            this.vectors.push(new THREE.Vector3(Math.random(), Math.random(), Math.random()));
        }
        if (this.readOnlyIndex !== null) {
            this.makeReadOnly(this.readOnlyIndex);
        }
    }

    public render(): void {
        this.container.innerHTML = `<h3>${this.label} Position Derivatives</h3>`;
        const vectorsList = document.createElement('div');

        this.vectors.forEach((vector, index) => {
            const vectorElement = document.createElement('div');
            vectorElement.className = 'vector-controls';
            const readOnly = this.vectorType === 'projectile' && index === this.readOnlyIndex;
            const removeDisabled = this.readOnlyIndex !== null && index < this.readOnlyIndex;
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

        const addButton = document.createElement('button');
        addButton.textContent = 'Add Vector';
        addButton.onclick = () => this.addVector();
        this.container.appendChild(addButton);
    }

    addVector(): void {
        this.vectors.push(new THREE.Vector3());
        this.render();
    }

    removeVector(index: number): void {
        this.vectors.splice(index, 1);
        this.render();
    }

    updateVector(index: number, component: 'x' | 'y' | 'z', value: number): void {
        if (!Number.isNaN(value)) {
            this.vectors[index][component] = value;
        }
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
}

export default VectorControl;
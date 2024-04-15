import * as THREE from 'three';

export class VectorControl {
    private vectors: THREE.Vector3[] = [];

    constructor(private containerId: string, private label: string, count: number = 5) {
        this.initializeVectors(count);
        this.render();
    }

    private initializeVectors(count: number): void {
        for (let i = 0; i < count; i++) {
            this.vectors.push(new THREE.Vector3(Math.random(), Math.random(), Math.random()));
        }
    }

    private render(): void {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        container.innerHTML = `<h3>${this.label} Position Derivatives</h3>`;

        this.vectors.forEach((vector, index) => {
            const vectorElement = document.createElement('div');
            vectorElement.innerHTML = `
                <label>Vector ${index + 1}: </label>
                <input type="number" value="${vector.x}" step="0.01" onchange="vectorControl.updateVector(${index}, 'x', parseFloat(this.value))">
                <input type="number" value="${vector.y}" step="0.01" onchange="vectorControl.updateVector(${index}, 'y', parseFloat(this.value))">
                <input type="number" value="${vector.z}" step="0.01" onchange="vectorControl.updateVector(${index}, 'z', parseFloat(this.value))">
                <button onclick="vectorControl.removeVector(${index})">Remove</button>
            `;
            container.appendChild(vectorElement);
        });

        const addButton = document.createElement('button');
        addButton.textContent = 'Add Vector';
        addButton.onclick = () => this.addVector();
        container.appendChild(addButton);
    }

    addVector(): void {
        this.vectors.push(new THREE.Vector3(0, 0, 0)); // Start with zero vector for simplicity
        this.render();
    }

    removeVector(index: number): void {
        this.vectors.splice(index, 1);
        this.render();
    }

    updateVector(index: number, component: 'x' | 'y' | 'z', value: number): void {
        if (this.vectors[index]) {
            this.vectors[index][component] = value;
        }
        this.render();
    }
}
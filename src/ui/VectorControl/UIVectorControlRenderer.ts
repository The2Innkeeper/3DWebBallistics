import * as THREE from 'three';
import { vectorControlManager } from './UIVectorControlManager';
import { UIVectorUpdateEvent } from './events';
import { eventBus } from '../../communication/EventBus';
import { UIVectorType } from './types/VectorType';
import { UIVectorElementFactory } from './UIVectorElementFactory';
import { UIVectorModel } from './UIVectorModel';

export class UIVectorControlRenderer {

    constructor(
        private container: HTMLElement,
        private label: string,
        private uiVectorModel: UIVectorModel,
        private vectorType: UIVectorType,
        private readOnlyIndices?: number[],
    ) {}

    public render(): void {
        this.container.innerHTML = `<h3>${this.label} Position Derivatives</h3>`;
        this.renderTopButtons();
        this.renderVectorsList();
        this.renderBottomButtons();
    }

    private renderTopButtons(): void {
        const clearAllButton = this.createButton('Clear All Vectors', () => {
            this.uiVectorModel.clearAllVectors();
            this.render();
        });
        const randomizeAllButton = this.createButton('Randomize All Vectors', () => {
            this.uiVectorModel.randomizeAllVectors();
            this.render();
        });

        this.container.appendChild(clearAllButton);
        this.container.appendChild(randomizeAllButton);
    }

    private renderVectorsList(): void {
        const vectorsList = document.createElement('div');

        this.uiVectorModel.getVectors().forEach((vector, index) => {
            const vectorElement = UIVectorElementFactory.createVectorElement(
                vector,
                index,
                this.vectorType,
                this.readOnlyIndices,
            );
            vectorsList.appendChild(vectorElement);
        });

        this.container.appendChild(vectorsList);
    }

    private renderBottomButtons(): void {
        const addZeroButton = this.createButton('Add Zero Vector', () => {
            this.uiVectorModel.addZeroVector();
            this.render();
        });
        const addRandomButton = this.createButton('Add Random Vector', () => {
            this.uiVectorModel.addRandomVector();
            this.render();
        });

        this.container.appendChild(addZeroButton);
        this.container.appendChild(addRandomButton);
    }

    private createButton(label: string, onClick: () => void): HTMLButtonElement {
        const button = document.createElement('button');
        button.textContent = label;
        button.onclick = onClick;
        return button;
    }
}
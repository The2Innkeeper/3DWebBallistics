import * as THREE from 'three';
import { vectorControlManager } from './UIVectorControlManager';
import { VectorUpdateEvent } from './events';
import { eventBus } from '../../communication/EventBus';
import { VectorType } from './types/VectorType';
import { UIVectorElementFactory } from './UIVectorElementFactory';
import { UIVectorModel } from './UIVectorModel';

export class UIVectorControlRenderer {

    constructor(
        private container: HTMLElement,
        private label: string,
        private uiVectorModel: UIVectorModel,
        private vectorType: VectorType,
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
            eventBus.emit(VectorUpdateEvent, new VectorUpdateEvent(this.vectorType, this.uiVectorModel.getVectors()));
        });
        const addRandomButton = this.createButton('Add Random Vector', () => {
            this.uiVectorModel.addRandomVector();
            this.render();
            eventBus.emit(VectorUpdateEvent, new VectorUpdateEvent(this.vectorType, this.uiVectorModel.getVectors()));
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

    private makeReadOnly(index: number): void {
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
}
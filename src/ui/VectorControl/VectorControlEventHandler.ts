import { VectorControl } from './VectorControl';

export class VectorControlEventHandler {
    constructor(private vectorControl: VectorControl) {
        this.attachEventListeners();
    }

    public attachEventListeners(): void {
        const vectorElements = this.vectorControl.getContainer().getElementsByClassName('vector-controls');
        Array.from(vectorElements).forEach((vectorElement, index) => {
            const inputs = vectorElement.getElementsByTagName('input');
            Array.from(inputs).forEach((input) => {
                input.addEventListener('change', this.handleVectorInputChange.bind(this));
            });

            const removeButton = vectorElement.querySelector('button');
            if (removeButton) {
                removeButton.addEventListener('click', () => {
                    this.handleRemoveButtonClick(index);
                });
            }
        });
    }

    public handleVectorInputChange(e: Event): void {
        const target = e.target as HTMLInputElement;
        const index = parseInt(target.dataset.index!, 10);
        const component = target.dataset.component as 'x' | 'y' | 'z';
        const value = parseFloat(target.value);
        console.log(`Vector input changed: index=${index}, component=${component}, value=${value}`);
        this.vectorControl.updateVector(index, component, value);
    }

    public handleRemoveButtonClick(index: number): void {
        console.log(`Remove button clicked: index=${index}`);
        this.vectorControl.removeVector(index);
    }
}
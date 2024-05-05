import { UIVectorModel } from './UIVectorModel';
import { UIVectorControlRenderer } from './UIVectorControlRenderer';

export class UIVectorControlEventHandler {
    constructor(private container: HTMLElement, private model: UIVectorModel, private renderer: UIVectorControlRenderer) {
        this.attachEventListeners();
    }

    private attachEventListeners(): void {
        this.container.addEventListener('change', this.handleEvent.bind(this));
    }

    private handleEvent(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target.tagName === 'INPUT' && target.type === 'number' && !target.readOnly) {
            const index = parseInt(target.dataset.index!);
            const component = target.dataset.component as 'x' | 'y' | 'z';
            const value = parseFloat(target.value);
            this.model.updateVector(index, component, value);
            this.renderer.render();
        }
    }
}

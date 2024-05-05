import { VectorType } from './types/VectorType';

class UIVectorTypeSelector {
    constructor(private vectorTypeSelector: HTMLSelectElement, private onVectorTypeChange: (selectedType: VectorType) => void) {
        this.initialize();
    }

    private initialize(): void {
        this.vectorTypeSelector.addEventListener('change', this.handleChange.bind(this));
    }

    private handleChange(event: Event): void {
        const selectedType = (event.target as HTMLSelectElement).value as VectorType;
        this.onVectorTypeChange(selectedType);
    }

    public getInitialType(): VectorType {
        return this.vectorTypeSelector.value as VectorType;
    }
}

export function createVectorTypeSelector(
    vectorTypeSelector: HTMLSelectElement,
    onVectorTypeChange: (selectedType: VectorType) => void
): UIVectorTypeSelector {
    return new UIVectorTypeSelector(vectorTypeSelector, onVectorTypeChange);
}
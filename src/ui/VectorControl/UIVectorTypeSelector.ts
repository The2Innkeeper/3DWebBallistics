import { UIVectorType } from './types/VectorType';

class UIVectorTypeSelector {
    constructor(private vectorTypeSelector: HTMLSelectElement, private onVectorTypeChange: (selectedType: UIVectorType) => void) {
        this.initialize();
    }

    private initialize(): void {
        this.vectorTypeSelector.addEventListener('change', this.handleChange.bind(this));
    }

    private handleChange(event: Event): void {
        const selectedType = (event.target as HTMLSelectElement).value as UIVectorType;
        this.onVectorTypeChange(selectedType);
    }

    public getInitialType(): UIVectorType {
        return this.vectorTypeSelector.value as UIVectorType;
    }
}

export function createVectorTypeSelector(
    vectorTypeSelector: HTMLSelectElement,
    onVectorTypeChange: (selectedType: UIVectorType) => void
): UIVectorTypeSelector {
    return new UIVectorTypeSelector(vectorTypeSelector, onVectorTypeChange);
}
import { UIVectorType, UIVectorTypes } from './types/UIVectorTypes';
import { GameControlRenderer } from '../controls/GameControlRenderer';

class UIVectorTypeSelector {
    private vectorControlsContainer: HTMLElement;
    private gameParametersRenderer: GameControlRenderer;

    constructor(private vectorTypeSelector: HTMLSelectElement, private onVectorTypeChange: (selectedType: UIVectorType | 'gameParameters') => void) {
        this.vectorControlsContainer = document.getElementById('vectorControlsContainer')!;
        this.gameParametersRenderer = new GameControlRenderer(this.vectorControlsContainer);
        this.initialize();
    }

    private initialize(): void {
        this.vectorTypeSelector.addEventListener('change', this.handleChange.bind(this));
        this.handleChange(); // Initialize the display based on the initial selection
    }

    private handleChange(event?: Event): void {
        const selectedType = this.vectorTypeSelector.value as UIVectorType | 'gameParameters';

        if (selectedType === 'gameParameters' || Object.values(UIVectorTypes).includes(selectedType)) {
            this.onVectorTypeChange(selectedType);
        } else {
            console.error(`Invalid vector type selected: ${this.vectorTypeSelector.value}`);
            return;
        }
    }

    public getInitialType(): UIVectorType | 'gameParameters' {
        return this.vectorTypeSelector.value as UIVectorType | 'gameParameters';
    }
}

export function createVectorTypeSelector(
    vectorTypeSelector: HTMLSelectElement,
    onVectorTypeChange: (selectedType: UIVectorType | 'gameParameters') => void
): UIVectorTypeSelector {
    return new UIVectorTypeSelector(vectorTypeSelector, onVectorTypeChange);
}
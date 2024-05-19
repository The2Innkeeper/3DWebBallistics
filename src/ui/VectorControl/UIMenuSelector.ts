import { UIVectorType, UIVectorTypes } from './types/UIVectorTypes';
import { GameControlRenderer } from '../controls/GameControlRenderer';

class UIMenuSelector {
    private vectorControlsContainer: HTMLElement;
    private gameParametersRenderer: GameControlRenderer;

    constructor(private menuSelector: HTMLSelectElement, private onVectorTypeChange: (selectedType: UIVectorType | 'gameParameters') => void) {
        this.vectorControlsContainer = document.getElementById('vectorControlsContainer')!;
        this.gameParametersRenderer = new GameControlRenderer(this.vectorControlsContainer);
        this.initialize();
    }

    private initialize(): void {
        this.menuSelector.addEventListener('change', this.handleChange.bind(this));
        this.handleChange(); // Initialize the display based on the initial selection
    }

    private handleChange(event?: Event): void {
        const selectedType = this.menuSelector.value as UIVectorType | 'gameParameters';

        if (selectedType === 'gameParameters' || Object.values(UIVectorTypes).includes(selectedType)) {
            this.onVectorTypeChange(selectedType);
        } else {
            console.error(`Invalid vector type selected: ${this.menuSelector.value}`);
            return;
        }
    }

    public getInitialType(): UIVectorType | 'gameParameters' {
        return this.menuSelector.value as UIVectorType | 'gameParameters';
    }
}

export function createMenuSelector(
    menuSelector: HTMLSelectElement,
    onVectorTypeChange: (selectedType: UIVectorType | 'gameParameters') => void
): UIMenuSelector {
    return new UIMenuSelector(menuSelector, onVectorTypeChange);
}
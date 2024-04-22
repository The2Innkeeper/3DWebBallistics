import SceneRenderer from './services/SceneRenderer';
import VectorControlManager from './services/VectorControlManager';
import MenuToggle from './ui/MenuToggle';
import VectorTypeSelector from './ui/VectorTypeSelector';
import WindowResizeHandler from './ui/WindowResizeHandler';

function initializeApp(): void {
    const sceneRenderer = new SceneRenderer();
    const vectorControlManager = new VectorControlManager();

    const menuToggle = document.getElementById('menu-toggle');
    const interfaceContainer = document.getElementById('interface-container');

    if (menuToggle && interfaceContainer) {
        new MenuToggle(menuToggle, interfaceContainer);
    }

    const vectorTypeSelector = document.getElementById('vectorTypeSelector') as HTMLSelectElement;
    const vectorTypeSelectorInstance = new VectorTypeSelector(vectorTypeSelector, (selectedType) => {
        vectorControlManager.handleVectorTypeChange(selectedType);
    });

    vectorControlManager.showInitialVectorControl(vectorTypeSelectorInstance.getInitialType());

    const onSizeChange = () => {
        const sceneContainer = document.getElementById('scene-container');
        if (sceneContainer) {
            sceneContainer.style.width = `${window.innerWidth}px`;
            sceneContainer.style.height = `${window.innerHeight}px`;
        }
    };

    new WindowResizeHandler(onSizeChange);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
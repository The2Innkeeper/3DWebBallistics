import { createSceneRenderer } from './rendering/SceneRenderer';
import { vectorControlManager } from './ui/VectorControl/VectorControlManager';
import MenuToggle from './ui/MenuToggle';
import { createVectorTypeSelector} from './ui/VectorTypeSelector';
import WindowResizeHandler from './ui/WindowResizeHandler';
import { projectileSpawner } from './simulation/spawners/ProjectileSpawner';


function initializeApp(): void {
    const sceneRenderer = createSceneRenderer();

    const menuToggle = document.getElementById('menu-toggle');
    const interfaceContainer = document.getElementById('interface-container');

    if (menuToggle && interfaceContainer) {
        new MenuToggle(menuToggle, interfaceContainer);
    }

    const vectorTypeSelector = document.getElementById('vectorTypeSelector') as HTMLSelectElement;
    const vectorTypeSelectorInstance = createVectorTypeSelector(vectorTypeSelector, (selectedType) => {
        vectorControlManager.handleVectorTypeChange(selectedType);
    });

    vectorControlManager.showInitialVectorControl(vectorTypeSelectorInstance.getInitialType());

    new WindowResizeHandler(() => onSizeChange(window.innerWidth, window.innerHeight));
}

function onSizeChange(width: number, height: number): void {
    const sceneContainer = document.getElementById('scene-container');
    if (sceneContainer) {
        sceneContainer.style.width = `${width}px`;
        sceneContainer.style.height = `${height}px`;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
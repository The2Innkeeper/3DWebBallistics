import { createSceneRenderer } from './rendering/SceneRenderer';
import { vectorControlManager } from './ui/VectorControl/VectorControlManager';
import MenuToggle from './ui/MenuToggle';
import { createVectorTypeSelector} from './ui/VectorControl/VectorTypeSelector';
import WindowResizeHandler from './ui/WindowResizeHandler';
import { getProjectileSpawner } from './simulation/spawners/ProjectileSpawner';
import { createTargetSpawner } from './simulation/spawners/TargetSpawner';
import { VectorType } from './ui/VectorControl/types/VectorType';
import * as THREE from 'three';
import { eventBus } from './communication/EventBus';

let globalScene: THREE.Scene;  // Declare a global variable to hold the scene reference

// Setup scene rendering and spawners
function setupScene() {
    const SceneRenderer = createSceneRenderer(); // Initializes and renders the scene renderer
    globalScene = SceneRenderer.scene; // Store the scene in the global variable
    const projectileSpawner = getProjectileSpawner(); // Uncomment and use as required
    eventBus.on('spawnProjectile', (scene: THREE.Scene) => projectileSpawner.spawnProjectile(scene, [new THREE.Vector3(1, 0, 0)]));
    const targetSpawner = createTargetSpawner(); // Uncomment and use as required
    eventBus.on('spawnTarget', (scene: THREE.Scene) => targetSpawner.spawnRandomTarget(scene));

    // Resize handling
    new WindowResizeHandler(resizeScene);
}

// Setup UI interactions, scene initialization, and button click handlers
function setupUI() {
    const menuToggleButton = document.getElementById('menu-toggle');
    const interfaceContainer = document.getElementById('interface-container');
    const spawnTargetButton = document.getElementById('spawn-target');
    const fireProjectileButton = document.getElementById('fire-projectile');

    if (menuToggleButton && interfaceContainer) {
        new MenuToggle(menuToggleButton, interfaceContainer);
    }
    
    const vectorTypeSelectorElement = document.getElementById('vectorTypeSelector') as HTMLSelectElement;
    if (vectorTypeSelectorElement) {
        const vectorTypeSelector = createVectorTypeSelector(vectorTypeSelectorElement, handleVectorTypeChange);
        vectorControlManager.showInitialVectorControl(vectorTypeSelector.getInitialType());
    }

    // Adding event listeners for spawning targets and projectiles
    if (spawnTargetButton) {
        spawnTargetButton.addEventListener('click', () => {
            eventBus.emit('spawnTarget', globalScene);
            console.log('Target spawn event triggered with scene.');
        });
    }

    if (fireProjectileButton) {
        fireProjectileButton.addEventListener('click', () => {
            eventBus.emit('spawnProjectile', globalScene);
            // getProjectileSpawner().spawnProjectile(globalScene, [new THREE.Vector3(1, 0, 0)]);  // Now passing scene as an argument
            console.log('Projectile spawn event triggered with scene.');
        });
    }
}

// Handle vector type selection change
function handleVectorTypeChange(selectedType: VectorType): void {
    vectorControlManager.handleVectorTypeChange(selectedType);
}

// Resize the scene container based on window size
function resizeScene(): void {
    const sceneContainer = document.getElementById('scene-container');
    if (sceneContainer) {
        sceneContainer.style.width = `${window.innerWidth}px`;
        sceneContainer.style.height = `${window.innerHeight}px`;
    }
}

// Initialize the application
function initializeApp(): void {
    setupUI();
    setupScene();
}

// Properly handle the document's readiness state
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
import { getRenderingSystem } from './simulation/systems/implementations/rendering/RenderingSystem';
import { vectorControlManager } from './ui/VectorControl/VectorControlManager';
import MenuToggle from './ui/MenuToggle';
import { createVectorTypeSelector } from './ui/VectorControl/VectorTypeSelector';
import WindowResizeHandler from './ui/WindowResizeHandler';
import { createRandomTargetSpawner } from './simulation/systems/implementations/spawners/RandomTargetSpawner';
import { VectorType } from './ui/VectorControl/types/VectorType';
import * as THREE from 'three';
import { eventBus } from './communication/EventBus';
import { Shooter } from './simulation/entities/implementations/Shooter';
import { SpawnRandomTargetEvent } from './communication/events/entities/spawning/SpawnRandomTargetEvent';
import { SpawnTargetEvent } from './communication/events/entities/spawning/SpawnTargetEvent';
import { scaledDisplacementDerivatives } from './simulation/components/implementations/MovementComponents';

let globalScene: THREE.Scene;  // Declare a global variable to hold the scene reference

// Setup scene rendering and spawners
function setupScene() {
    const renderingSystem = getRenderingSystem(); // Initializes and renders the scene renderer
    globalScene = renderingSystem.getScene(); // Get the scene instance from the rendering system

    const targetSpawner = createRandomTargetSpawner(globalScene); // Pass the scene and minDistance to the target spawner

    // Create a shooter instance and add it to the scene
    const shooter = new Shooter();
    shooter.addToScene(globalScene);

    renderingSystem.animate();

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
            const displacementDerivatives = scaledDisplacementDerivatives;
            eventBus.emit(SpawnTargetEvent, new SpawnTargetEvent(displacementDerivatives));
            console.log('Spawn target event triggered with displacement derivatives:', displacementDerivatives);
        });
    }

    // if (fireProjectileButton) {
    //     fireProjectileButton.addEventListener('click', () => {
    //         const projectileVelocity = new THREE.Vector3(0, 0, 1); // Example velocity vector
    //         eventBus.emit('spawnProjectile', projectileVelocity);
    //         console.log(`Projectile spawn event triggered with velocity ${projectileVelocity}.`);
    //     });
    // }
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
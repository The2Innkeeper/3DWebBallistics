// app.ts
import * as THREE from 'three';
import { getRenderingSystem } from './simulation/systems/rendering/RenderingSystem';
import { MenuToggle } from './ui/MenuToggle';
import { createVectorTypeSelector } from './ui/VectorControl/UIVectorTypeSelector';
import { WindowResizeHandler } from './ui/WindowResizeHandler';
import { createRandomTargetSpawner } from './simulation/systems/spawners/RandomTargetSpawner';
import { UIVectorType, UIVectorTypes } from './ui/VectorControl/types/VectorType';
import { eventBus } from './communication/EventBus';
import { Shooter } from './simulation/entities/implementations/Shooter';
import { SpawnRandomTargetEvent } from './communication/events/entities/spawning/SpawnRandomTargetEvent';
import { SpawnTargetEvent } from './communication/events/entities/spawning/SpawnTargetEvent';
import { gameLoop } from './simulation/systems/GameLoop';
import { createTargetSpawner } from './simulation/systems/spawners/TargetSpawner';
import { SpawnProjectileEvent } from './communication/events/entities/spawning/SpawnProjectileEvent';
import { entityManager } from './simulation/systems/EntityManager';
import { createProjectileSpawner } from './simulation/systems/spawners/ProjectileSpawner';
import { vectorControlManager } from './ui/VectorControl/UIVectorControlManager';
import { computeScaledPositionDerivatives } from './simulation/utils/MovementUtils';
import { ProjectileSetting, getProjectileSetting } from './simulation/components/projectileSettings';

let globalScene: THREE.Scene;  // Declare a global variable to hold the scene reference

// Setup scene rendering and spawners
function setupScene() {
    const renderingSystem = getRenderingSystem(); // Initializes and renders the scene renderer
    globalScene = renderingSystem.getScene(); // Get the scene instance from the rendering system

    const targetSpawner = createTargetSpawner(globalScene); // Pass the scene and minDistance to the target spawner
    const randomTargetSpawner = createRandomTargetSpawner(globalScene);
    const projectileSpawner = createProjectileSpawner(globalScene);

    // Create a shooter instance and add it to the scene
    const shooter = new Shooter();
    shooter.addToScene(globalScene);

    // Start the animation loop
    renderingSystem.animate();

    // Resize handling
    new WindowResizeHandler(resizeScene);
}

// Setup UI interactions, scene initialization, and button click handlers
function setupUI() {
    const menuToggleButton = document.getElementById('menu-toggle');
    const interfaceContainer = document.getElementById('interface-container');
    const spawnTargetButton = document.getElementById('spawn-target');
    const spawnRandomTargetButton = document.getElementById('spawn-random-target');
    const fireProjectileButton = document.getElementById('fire-projectile');

    if (menuToggleButton && interfaceContainer) {
        new MenuToggle(menuToggleButton, interfaceContainer);
    }
    
    const vectorTypeSelectorElement = document.getElementById('vectorTypeSelector') as HTMLSelectElement;
    if (vectorTypeSelectorElement) {
        const vectorTypeSelector = createVectorTypeSelector(vectorTypeSelectorElement, handleVectorTypeChange);
        vectorControlManager.showInitialVectorControl();
    }

    // Adding event listeners for spawning targets and projectiles
    spawnTargetButton?.addEventListener('click', () => {
        const uiVectors = vectorControlManager.getAllVectorValues();
        eventBus.emit(SpawnTargetEvent, new SpawnTargetEvent(uiVectors.target, uiVectors.shooter));
        console.log('Spawn target event triggered with vectors:', uiVectors.target, uiVectors.shooter);
    });

    spawnRandomTargetButton?.addEventListener('click', () => {
        eventBus.emit(SpawnRandomTargetEvent, new SpawnRandomTargetEvent());
        console.log('Spawn random target event triggered');
    })

    fireProjectileButton?.addEventListener('click', () => {
        const target = entityManager.getOldestUnengagedTarget();
        if (!target) {
            console.log('No unengaged target available. Skipping projectile spawn.');
            return;
        }

        const uiVectors = vectorControlManager.getAllVectorValues();
        eventBus.emit(SpawnProjectileEvent, new SpawnProjectileEvent(
            uiVectors.target, 
            uiVectors.shooter, 
            uiVectors.projectile, 
            getProjectileSetting(ProjectileSetting.IndexToMinimize), 
            getProjectileSetting(ProjectileSetting.FallbackIntersectionTime), 
            target
        ));
        console.log(`Projectile spawn event triggered with ${uiVectors.target}, ${uiVectors.shooter}, ${uiVectors.projectile}, indexToMinimize ${getProjectileSetting(ProjectileSetting.IndexToMinimize)}, fallbackIntersectionTime ${getProjectileSetting(ProjectileSetting.FallbackIntersectionTime)} and target ${ target}.`);
    });
}

// Handle vector type selection change
function handleVectorTypeChange(selectedType: UIVectorType): void {
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
    gameLoop.start();
}

// Properly handle the document's readiness state
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

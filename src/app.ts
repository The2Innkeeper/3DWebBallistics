import * as THREE from 'three';
import { getRenderingSystem } from './simulation/systems/rendering/RenderingSystem';
import { MenuToggle } from './ui/MenuToggle';
import { createVectorTypeSelector } from './ui/VectorControl/UIVectorTypeSelector';
import { WindowResizeHandler } from './ui/WindowResizeHandler';
import { createRandomTargetSpawner } from './simulation/systems/spawners/RandomTargetSpawner';
import { UIVectorType } from './ui/VectorControl/types/VectorType';
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
import { getProjectileSetting, ProjectileSetting } from './simulation/components/projectileSettings';
import { ExplosionHandler } from './simulation/systems/collision/ExplosionHandler';

let globalScene: THREE.Scene; // Global scene reference

// Setup scene rendering and spawners
function setupScene() {
    const renderingSystem = getRenderingSystem();
    globalScene = renderingSystem.getScene();

    createTargetSpawner(globalScene);
    createRandomTargetSpawner(globalScene);
    createProjectileSpawner(globalScene);

    const shooter = new Shooter();
    shooter.addToScene(globalScene);

    renderingSystem.animate();

    new WindowResizeHandler(resizeScene);

    // Initialize ExplosionHandler with the scene and camera
    new ExplosionHandler(globalScene, renderingSystem.getCamera());
}

// Setup UI interactions and button click handlers
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
        createVectorTypeSelector(vectorTypeSelectorElement, handleVectorTypeChange);
        vectorControlManager.showInitialVectorControl();
    }

    // Event listeners for spawning targets and projectiles
    spawnTargetButton?.addEventListener('click', () => {
        const uiVectors = vectorControlManager.getAllVectorValues();
        eventBus.emit(SpawnTargetEvent, new SpawnTargetEvent(uiVectors.target, uiVectors.shooter));
        console.log('Spawn target event triggered with vectors:', uiVectors.target, uiVectors.shooter);
    });

    spawnRandomTargetButton?.addEventListener('click', () => {
        eventBus.emit(SpawnRandomTargetEvent, new SpawnRandomTargetEvent());
        console.log('Spawn random target event triggered');
    });

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
        const targetDetails = {
            target: JSON.stringify(uiVectors.target),
            shooter: JSON.stringify(uiVectors.shooter),
            projectile: JSON.stringify(uiVectors.projectile),
            indexToMinimize: getProjectileSetting(ProjectileSetting.IndexToMinimize),
            fallbackIntersectionTime: getProjectileSetting(ProjectileSetting.FallbackIntersectionTime),
            targetObject: target ? {
                scaledTargetDerivatives: JSON.stringify(target.getScaledPositionDerivatives()),
                position: JSON.stringify(target.position),
                lifetime: target.lifeTime
            } : null,
        };
        console.log(`Projectile spawn event triggered with ${JSON.stringify(targetDetails)}`);
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
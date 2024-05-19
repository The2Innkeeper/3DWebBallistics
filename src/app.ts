import * as THREE from 'three';
import { gameLoop } from './simulation/systems/GameLoop';
import { setupUI } from './ui/setupUI';
import { setupScene } from './simulation/systems/rendering/setupScene';
import { setupTutorial } from './ui/tutorial/TutorialManager';

export let globalScene: THREE.Scene; // Global scene reference

// Initialize the application
function initializeApp(): void {
    globalScene = setupScene();
    setupUI();
    setupTutorial();
    gameLoop.start();
}

// Properly handle the document's readiness state
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
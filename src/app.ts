import SceneRenderer from './ui/SceneRenderer';
import VectorControl from './services/VectorControlService';

// Initialization function for your app
function initializeApp(): void {
    const sceneRenderer = new SceneRenderer();
    // ... setup for sceneRenderer if necessary

    type VectorType = 'shooter' | 'projectile' | 'target';

    const vectorControls: Record<VectorType, VectorControl> = {
        shooter: new VectorControl('shooterVectors', 'shooter', 'Shooter Vectors', 3),
        projectile: new VectorControl('projectileVectors', 'projectile', 'Projectile Vectors', 3),
        target: new VectorControl('targetVectors', 'target', 'Target Vectors', 3)
    };

    // Hide all vector controls initially
    Object.values(vectorControls).forEach(control => control.hide());

    // Menu toggle button
    const menuToggle = document.getElementById('menu-toggle');
    const interfaceContainer = document.getElementById('interface-container');
    const sceneContainer = document.getElementById('scene-container');

    if (menuToggle && interfaceContainer) {
        // Initialize button based on whether the interface is hidden
        const initialInterfaceWidth = interfaceContainer.classList.contains('interface-hidden') ? 0 : interfaceContainer.offsetWidth;
        menuToggle.style.transform = `translateX(${initialInterfaceWidth}px)`;

        const toggleMenu = () => {
            // Toggle class first to get the new width
            interfaceContainer.classList.toggle('interface-hidden');

            // Now the new state will tell us if the interface is meant to be hidden or shown
            const isInterfaceHidden = interfaceContainer.classList.contains('interface-hidden');
            
            // Wait for the next animation frame to get the updated width
            requestAnimationFrame(() => {
                const interfaceWidth = isInterfaceHidden ? 0 : interfaceContainer.offsetWidth;
                const transitionTime = '250ms'; // Transition time for both the interface and the button
                
                // Apply the transition to both the interface and the button
                interfaceContainer.style.transition = `transform ${transitionTime}`;
                menuToggle.style.transition = `transform ${transitionTime}`;

                // Set the transform to move the button
                menuToggle.style.transform = isInterfaceHidden ? 'translateX(0)' : `translateX(${interfaceWidth}px)`;

                onSizeChange(); // Adjust layout when the sidebar is toggled
            });
        };
        
        menuToggle.addEventListener('click', toggleMenu);
    }

    // Dropdown menu logic
    const vectorTypeSelector = document.getElementById('vectorTypeSelector') as HTMLSelectElement;
    vectorTypeSelector.addEventListener('change', (event) => {
        const selectedType = (event.target as HTMLSelectElement).value as VectorType;

        // Type guard to ensure the selected type is a valid key
        if (selectedType in vectorControls) {
            // Hide all vector controls
            Object.values(vectorControls).forEach(control => control.hide());

            // Show the selected vector control
            vectorControls[selectedType].show();
        }
    });

    // Show the initial vector control based on the dropdown's default value
    vectorControls[vectorTypeSelector.value as VectorType].show();
}

// Call initializeApp when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Window resize listener and polling to adjust layout if necessary
let width: number = window.innerWidth;
let height: number = window.innerHeight;

function onSizeChange(): void {
    const sceneContainer = document.getElementById('scene-container');
    if (sceneContainer) {
        sceneContainer.style.width = `${window.innerWidth}px`;
        sceneContainer.style.height = `${window.innerHeight}px`;
        // Trigger any additional layout adjustments here
    }
}

window.addEventListener('resize', () => {
    if (window.innerWidth !== width || window.innerHeight !== height) {
        width = window.innerWidth;
        height = window.innerHeight;
        onSizeChange();
    }
});

setInterval(() => {
    if (window.innerWidth !== width || window.innerHeight !== height) {
        width = window.innerWidth;
        height = window.innerHeight;
        onSizeChange();
    }
}, 1000); // Check every 1000 milliseconds
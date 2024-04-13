import * as dat from 'dat.gui';

import {camera, renderer, scene, sphere} from "./sceneSetup.js";
import {controls} from "./controls.js";

// Simulation parameters
let animationActive = false;
const params = {
    velocity: 20,
    angle: 45,
    gravity: -9.81,
    timeScale: 1, // Control the simulation speed
    startAnimation: function () { animationActive = true; },
    stopAnimation: function () { animationActive = false; resetSimulation(); }
};

// GUI controls
const gui = new dat.GUI();
gui.add(params, 'velocity', 1, 100).name('Velocity').onChange(resetSimulation);
gui.add(params, 'angle', 0, 90).name('Launch Angle').onChange(resetSimulation);
gui.add(params, 'gravity', -20, 0).name('Gravity').onChange(resetSimulation);
gui.add(params, 'timeScale', 0.1, 2).name('Time Scale');
gui.add(params, 'startAnimation').name('Start Animation');
gui.add(params, 'stopAnimation').name('Stop Animation');

// Function to reset the simulation
function resetSimulation() {
    time = 0;
    sphere.position.set(0, 0, 0);
}

// Continuous render loop
function render() {
    requestAnimationFrame(render);
    controls.update(); // Update camera controls
    renderer.render(scene, camera);
}

// Time management
let time = 0;
let lastTime = 0;

// Animation loop
function animate(currentTime) {
    if (animationActive) {
        const deltaTime = (currentTime - lastTime) * 0.001 * params.timeScale;
        lastTime = currentTime;

        // Use deltaTime for time increment
        time += deltaTime;

        // Calculate new positions
        const angleRad = params.angle * (Math.PI / 180);
        let posX = params.velocity * Math.cos(angleRad) * time;
        let posY = (params.velocity * Math.sin(angleRad) * time) + (0.5 * params.gravity * Math.pow(time, 2));

        sphere.position.x = posX;
        sphere.position.y = posY;

        // Reset if the sphere hits the ground
        if (sphere.position.y < 0) {
            params.stopAnimation(); // Stop the animation when the sphere hits the ground
        }
    } else {
        lastTime = currentTime; // Ensure smooth restart
    }

    requestAnimationFrame(animate);
}

render(); // Start the continuous rendering loop
animate(0); // Start the animation loop
import { scene, camera, renderer } from './sceneSetup.js';
import { controls } from './controls.js';
import * as THREE from 'three';

// Ball
const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const ballMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
scene.add(ball);

// Ballistics
let velocity = new THREE.Vector3(2, 5, 0); // Initial velocity
const gravity = new THREE.Vector3(0, -0.1, 0); // Gravity effect

function animate() {
    requestAnimationFrame(animate);

    // Ballistics simulation
    velocity.add(gravity);
    ball.position.add(velocity.clone().multiplyScalar(0.1)); // Adjust speed

    if(ball.position.y < 0.5) { // Simple ground collision detection
        velocity.y *= -0.8; // Bounce back with energy loss
        ball.position.y = 0.5; // Reset position to ground level
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();
import * as THREE from 'three';

/**
 * Detects collision between two objects. Assumes objects have a position and a radius.
 * @param projectile The moving object, typically a THREE.Mesh with a position.
 * @param target The target object, typically a THREE.Mesh with a position.
 * @param sumRadii The sum of the radii of the projectile and target, determining collision proximity.
 * @returns true if a collision is detected, false otherwise.
 */
function detectCollision(projectile: THREE.Object3D, target: THREE.Object3D, sumRadii: number): boolean {
    return projectile.position.distanceTo(target.position) <= sumRadii;
}

/**
 * Triggers an explosion at the specified position and cleans up the particles after a set duration.
 * @param scene The THREE.Scene to which the particles are added.
 * @param position The position at which to trigger the explosion (THREE.Vector3).
 * @param material The material for the particle points (THREE.Material).
 * @param duration The duration in milliseconds after which the particles are cleaned up.
 */
function triggerExplosion(scene: THREE.Scene, position: THREE.Vector3, material: THREE.Material, duration: number = 2000): void {
    const particlesCount = 100;
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
        posArray[i * 3 + 0] = position.x + (Math.random() - 0.5) * 0.2;
        posArray[i * 3 + 1] = position.y + (Math.random() - 0.5) * 0.2;
        posArray[i * 3 + 2] = position.z + (Math.random() - 0.5) * 0.2;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particles = new THREE.Points(particlesGeometry, material);
    scene.add(particles);

    // Schedule cleanup
    setTimeout(() => {
        scene.remove(particles);
        particlesGeometry.dispose();
        material.dispose();
    }, duration);
}
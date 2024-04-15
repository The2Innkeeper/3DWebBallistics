import * as THREE from 'three';
import { IMovable } from 'src/interfaces/IMovable';

export class Target implements IMovable {
    position: THREE.Vector3;
    private scaledPositionDerivatives: THREE.Vector3[];
    private lifeTime: number;
    radius: number;
    height: number;
    private mesh: THREE.Mesh;

    constructor(targetPositionDerivatives: THREE.Vector3[],
                shooterPositionDerivatives: THREE.Vector3[],
                radius: number = 0.875,
                height: number = 0.25,
                radialSegments: number = 32
            ) {
        this.position = targetPositionDerivatives[0].clone();
        this.radius = radius;
        this.height = height;
        this.lifeTime = 0;

        // Determine the longer array to pad the shorter one
        const maxLength = shooterPositionDerivatives.length >= 1 ||
                        targetPositionDerivatives.length >= 1 ?
                        Math.max(shooterPositionDerivatives.length, targetPositionDerivatives.length) : 
                        1;
        const paddedShooterPositionDerivatives = padWithZeros(shooterPositionDerivatives, maxLength);
        const paddedTargetPositionDerivatives = padWithZeros(targetPositionDerivatives, maxLength);

        // Compute the scaled position derivatives based on Taylor expansion
        this.scaledPositionDerivatives = [];
        let factorial = 1; // Start with 0! which is 1
        for (let i = 0; i < maxLength; i++) {
            if (i > 0) factorial *= i;
            const scaledDerivative = paddedTargetPositionDerivatives[i].clone().sub(paddedShooterPositionDerivatives[i]);
            this.scaledPositionDerivatives.push(scaledDerivative.divideScalar(factorial));
        }

        // Create the mesh for the cylinder
        const geometry = new THREE.CylinderGeometry(radius, radius, height, radialSegments);
        geometry.rotateX(Math.PI / 2); // Orient the cylinder's height along the x-axis
        const material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF }); // White color
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);

        // Initial orientation to face the origin
        this.orientTowardsShooterAtOrigin();
    }
    
    updatePosition(deltaTime: number): void {
        this.lifeTime += deltaTime;
        this.position = this.evaluatePositionAt(this.lifeTime);
        this.mesh.position.copy(this.position);

        // Orient the target to face the origin
        this.orientTowardsShooterAtOrigin();
    }

    private orientTowardsShooterAtOrigin(): void {
        const origin = new THREE.Vector3(0, 0, 0);
        const direction = new THREE.Vector3().subVectors(origin, this.position).normalize();
        this.mesh.lookAt(direction);
    }

    private evaluatePositionAt(time: number): THREE.Vector3 {
        let position = new THREE.Vector3(0, 0, 0); // Start with a zero vector for accumulation

        // Evaluate the polynomial using Horner's method with pre-scaled coefficients
        for (let i = this.scaledPositionDerivatives.length - 1; i >= 0; i--) {
            position.multiplyScalar(time).add(this.scaledPositionDerivatives[i]);
        }

        return position;
    }

    // Method to add the target to a scene
    addToScene(scene: THREE.Scene): void {
        scene.add(this.mesh);
    }

    // Method to remove the target from a scene
    removeFromScene(scene: THREE.Scene): void {
        scene.remove(this.mesh);
    }
}

// Helper function to pad an array of vectors with zeros
function padWithZeros(array: THREE.Vector3[], length: number): THREE.Vector3[] {
    while (array.length < length) {
        array.push(new THREE.Vector3(0, 0, 0));
    }
    return array;
}
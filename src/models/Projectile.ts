import * as THREE from 'three';
import { IMovable } from '../interfaces/IMovable';
import { Target } from './Target';
import { eventBus } from '../events/EventBus';
import { checkCollision } from '../simulation/CollisionDetection';

export class Projectile implements IMovable {
    position: THREE.Vector3;
    private target: Target;
    private scaledPositionDerivatives: THREE.Vector3[]; // Pre-scaled derivatives for the Taylor series
    private lifeTime: number; // Time since the projectile was spawned
    radius: number;

    constructor(scaledPositionDerivatives: THREE.Vector3[], radius: number, target: Target) {
        this.position = scaledPositionDerivatives[0].clone();
        this.scaledPositionDerivatives = scaledPositionDerivatives.map(derivative => derivative.clone());
        this.radius = radius;
        this.target = target;
        this.lifeTime = 0;
    }

    updatePosition(deltaTime: number): void {
        this.lifeTime += deltaTime;
        this.position = this.evaluatePositionAt(this.lifeTime);
        
        if (checkCollision(this, this.target)) {
            eventBus.emit('collision', { projectile: this, target: this.target });
        }
    }

    private evaluatePositionAt(time: number): THREE.Vector3 {
        let position = new THREE.Vector3(0, 0, 0); // Start with a zero vector for accumulation

        // Evaluate the polynomial using Horner's method with pre-scaled coefficients
        for (let i = this.scaledPositionDerivatives.length - 1; i >= 0; i--) {
            position.multiplyScalar(time).add(this.scaledPositionDerivatives[i]);
        }

        return position;
    }
}
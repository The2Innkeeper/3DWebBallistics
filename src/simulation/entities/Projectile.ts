import * as THREE from 'three';
import { IMovable } from './interfaces/IMovable';
import { Target } from './Target';
import { eventBus } from '../../communication/EventBus';
import { checkCollision } from '../core/physics/CollisionDetection';

export class Projectile implements IMovable {
    position: THREE.Vector3;
    radius: number;
    lifeTime: number; // Time since the projectile was spawned
    maxLifeTime: number = 20; // Maximum lifetime of the projectile in seconds
    maxDistance: number = 1000; // Maximum distance from the origin in meters

    private scaledPositionDerivatives: THREE.Vector3[]; // Pre-scaled derivatives for the Taylor series
    target: IMovable;

    constructor(scaledPositionDerivatives: THREE.Vector3[], radius: number, target: IMovable, maxLifeTime: number, maxDistance: number) {
        this.position = scaledPositionDerivatives[0].clone();
        this.radius = radius;
        this.lifeTime = 0;
        this.maxLifeTime = maxLifeTime;
        this.maxDistance = maxDistance;

        this.target = target;
        this.scaledPositionDerivatives = scaledPositionDerivatives.map(derivative => derivative.clone());
    }

    /**
     * Updates the position of the projectile based on the given delta time.
     * If the projectile's lifetime exceeds the maximum lifetime or if it goes beyond the bounds,
     * it emits a 'projectileExpired' event and returns.
     * Otherwise, it evaluates the position of the projectile at the current lifetime and updates it.
     * If a collision is detected between the projectile and the target, it emits a 'collision' event.
     *
     * @param {number} deltaTime - The time elapsed IN SECONDS since the last update.
     * @return {void} This function does not return anything.
     */
    updatePosition(deltaTime: number): void {
        this.lifeTime += deltaTime;

        if (this.isExpired()) {
            eventBus.emit('projectileExpired', this);
            return;
        }

        this.position = this.evaluatePositionAt(this.lifeTime);
        
        if (checkCollision(this, this.target)) {
            eventBus.emit('collision', { projectile: this, target: this.target });
        }
    }

    isExpired(): boolean {
        return this.lifeTime > this.maxLifeTime || this.position.lengthSq() > this.maxDistance ** 2;
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
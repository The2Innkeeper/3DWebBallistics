// MovementUtils.ts
import * as THREE from 'three';
import { scaledDisplacementDerivatives, scaledProjectileDerivatives } from '../components/implementations/MovementComponents';

/**
 * Computes the displacement derivatives between the shooter and target position derivatives.
 * displacement[i] = target[i] - shooter[i]
 *
 * @param {THREE.Vector3[]} targetPositionDerivatives - The target position derivatives.
 * @param {THREE.Vector3[]} shooterPositionDerivatives - The shooter position derivatives.
 * @return {THREE.Vector3[]} The computed displacement derivatives = target - shooter.
 */
export function computeDisplacementDerivatives(
    targetPositionDerivatives: THREE.Vector3[],
    shooterPositionDerivatives: THREE.Vector3[]
): THREE.Vector3[] {
    const minLength = Math.min(targetPositionDerivatives.length, shooterPositionDerivatives.length);
    const maxLength = Math.max(targetPositionDerivatives.length, shooterPositionDerivatives.length);
    const displacementDerivatives: THREE.Vector3[] = new Array(maxLength);

    for (let i = 0; i < minLength; i++) {
        displacementDerivatives[i] = targetPositionDerivatives[i].clone().sub(shooterPositionDerivatives[i]);
    }

    if (targetPositionDerivatives.length > minLength) {
        for (let i = minLength; i < targetPositionDerivatives.length; i++) {
            displacementDerivatives[i] = targetPositionDerivatives[i].clone();
        }
    } else if (shooterPositionDerivatives.length > minLength) {
        for (let i = minLength; i < shooterPositionDerivatives.length; i++) {
            displacementDerivatives[i] = shooterPositionDerivatives[i].clone().negate();
        }
    }

    return displacementDerivatives;
}

/**
 * Computes the scaled position derivatives by dividing each derivative by its corresponding factorial.
 *
 * @param {THREE.Vector3[]} derivatives - The position derivatives to be scaled.
 * @return {THREE.Vector3[]} The scaled position derivatives.
 */
export function computeScaledPositionDerivatives(derivatives: THREE.Vector3[]): THREE.Vector3[] {
    return derivatives.map((derivative, index) => {
        const factorial = computeFactorial(index);
        return derivative.clone().divideScalar(factorial);
    });
}

/**
 * Computes the factorial of a given number.
 *
 * @param {number} n - The number for which to compute the factorial.
 * @return {number} The factorial of the given number.
 */
function computeFactorial(n: number): number {
    if (n < 0) {
        throw new Error('Factorial is not defined for negative numbers.');
    }

    if (n === 0 || n === 1) {
        return 1;
    }

    let factorial = 2;

    for (let i = 2; i <= n; i++) {
        factorial *= i + 1;
    }

    return factorial;
}

/**
 * Updates the scaled displacement derivatives based on the target and shooter position derivatives.
 *
 * @param {THREE.Vector3[]} targetPositionDerivatives - The target position derivatives.
 * @param {THREE.Vector3[]} shooterPositionDerivatives - The shooter position derivatives.
 */
export function updateScaledDisplacementDerivatives(
    targetPositionDerivatives: THREE.Vector3[],
    shooterPositionDerivatives: THREE.Vector3[]
): void {
    const displacementDerivatives = computeDisplacementDerivatives(targetPositionDerivatives, shooterPositionDerivatives);
    scaledDisplacementDerivatives.length = 0;
    scaledDisplacementDerivatives.push(...computeScaledPositionDerivatives(displacementDerivatives));
    console.log('Updated scaled displacement derivatives:', scaledDisplacementDerivatives);
}

/**
 * Updates the scaled projectile derivatives based on the provided projectile derivatives.
 *
 * @param {THREE.Vector3[]} projectileDerivatives - The projectile derivatives.
 */
export function updateScaledProjectileDerivatives(projectileDerivatives: THREE.Vector3[]): void {
    scaledProjectileDerivatives.length = 0;
    scaledProjectileDerivatives.push(...computeScaledPositionDerivatives(projectileDerivatives));
    console.log('Updated scaled projectile derivatives:', scaledProjectileDerivatives);
}
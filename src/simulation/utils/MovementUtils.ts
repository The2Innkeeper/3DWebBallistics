// MovementUtils.ts
import * as THREE from 'three';
import { scaledShooterTargetDisplacementDerivatives as scaledTargetDerivatives, scaledProjectileShooterDisplacementDerivatives as scaledProjectileDerivatives } from '../components/MovementComponents';

/**
 * Computes the displacement derivatives between from the first entity (tail) to the second entity (tip).
 * ABdisplacement[i] = B[i] - A[i]
 *
 * @param {THREE.Vector3[]} tailPositionDerivatives - The first entity's position derivatives.
 * @param {THREE.Vector3[]} tipPositionDerivatives - The second entity's position derivatives.
 * @return {THREE.Vector3[]} The computed displacement derivatives = tip - tail.
 */
export function computeDisplacementDerivatives(
    tailPositionDerivatives: THREE.Vector3[],
    tipPositionDerivatives: THREE.Vector3[]
): THREE.Vector3[] {
    const minLength = Math.min(tailPositionDerivatives.length, tipPositionDerivatives.length);
    const maxLength = Math.max(tailPositionDerivatives.length, tipPositionDerivatives.length);
    const displacementDerivatives: THREE.Vector3[] = new Array(maxLength).fill(null).map(() => new THREE.Vector3(0, 0, 0));

    for (let i = 0; i < minLength; i++) {
        if (tailPositionDerivatives[i] && tipPositionDerivatives[i]) {
            displacementDerivatives[i].copy(tailPositionDerivatives[i]).sub(tipPositionDerivatives[i]);
        } else {
            console.error(`Undefined vector found at index: ${i}, `
                        + `tail:, ${JSON.stringify(tailPositionDerivatives[i])}, `
                        + `tip: ${JSON.stringify(tipPositionDerivatives[i])}, `
                        + `tailPositionDerivatives: ${JSON.stringify(tailPositionDerivatives)}, `
                        + `tipPositionDerivatives: ${JSON.stringify(tipPositionDerivatives)}`
                    );
        }
    }

    for (let i = minLength; i < maxLength; i++) {
        if (i < tailPositionDerivatives.length && tailPositionDerivatives[i]) {
            displacementDerivatives[i].copy(tailPositionDerivatives[i]);
        } else if (i < tipPositionDerivatives.length && tipPositionDerivatives[i]) {
            displacementDerivatives[i].copy(tipPositionDerivatives[i]).negate();
        } else {
            console.error('Undefined vector found at index', i);
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
export function computeFactorial(n: number): number {
    if (n < 0) {
        throw new Error('Factorial is not defined for negative numbers.');
    }

    if (n === 0 || n === 1) {
        return 1;
    }

    let factorial = 1;

    for (let i = 2; i <= n; i++) {
        factorial *= i;
    }

    return factorial;
}

/**
 * Updates the scaled displacement derivatives based on the given position derivatives.
 *
 * @param {THREE.Vector3[]} targetPositionDerivatives - The target position derivatives.
 * @param {THREE.Vector3[]} shooterPositionDerivatives - The shooter position derivatives.
 * @param {THREE.Vector3[]} projectileDisplacementDerivatives - Optional parameter for projectile displacement derivatives.
 */
export function updateScaledDisplacementDerivatives(
    targetPositionDerivatives: THREE.Vector3[],
    shooterPositionDerivatives: THREE.Vector3[],
    projectileDisplacementDerivatives?: THREE.Vector3[],
): void {
    function validateVectors(vectors: THREE.Vector3[], vectorType: string): void {
        vectors.forEach((vec, index) => {
            if (vec === undefined || vec === null || !(vec instanceof THREE.Vector3)) {
                console.error(`Invalid vector at index ${index} in ${vectorType} derivatives:`, vectors);
            }
        });
    }

    validateVectors(targetPositionDerivatives, 'target');
    validateVectors(shooterPositionDerivatives, 'shooter');

    const targetDisplacementDerivatives = computeDisplacementDerivatives(targetPositionDerivatives, shooterPositionDerivatives);
    scaledTargetDerivatives.length = 0;
    scaledTargetDerivatives.push(...computeScaledPositionDerivatives(targetDisplacementDerivatives));
    console.log('Updated scaledTargetDerivatives:', scaledTargetDerivatives);
    
    if (!projectileDisplacementDerivatives) { return; }

    const projectileDerivatives = computeDisplacementDerivatives(projectileDisplacementDerivatives, targetDisplacementDerivatives);
    scaledProjectileDerivatives.length = 0;
    scaledProjectileDerivatives.push(...computeScaledPositionDerivatives(projectileDerivatives));
    console.log('Updated scaledProjectileDerivatives:', scaledProjectileDerivatives);
}

export function getScaledShooterTargetDisplacementDerivatives(): THREE.Vector3[] {
    return scaledTargetDerivatives;
}

export function getScaledProjectileShooterDisplacementDerivatives(): THREE.Vector3[] {
    return scaledProjectileDerivatives;
}

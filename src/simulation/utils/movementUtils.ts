import * as THREE from 'three';


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
    const displacementDerivatives: THREE.Vector3[] = new Array(minLength);

    for (let i = 0; i < minLength; i++) {
        displacementDerivatives[i] = new THREE.Vector3(
            targetPositionDerivatives[i].x - shooterPositionDerivatives[i].x,
            targetPositionDerivatives[i].y - shooterPositionDerivatives[i].y,
            targetPositionDerivatives[i].z - shooterPositionDerivatives[i].z
        );
    }

    if (targetPositionDerivatives.length > minLength) {
        for (let i = minLength; i < targetPositionDerivatives.length; i++) {
            displacementDerivatives.push(targetPositionDerivatives[i].clone());
        }
    } else if (shooterPositionDerivatives.length > minLength) {
        for (let i = minLength; i < shooterPositionDerivatives.length; i++) {
            displacementDerivatives.push(new THREE.Vector3(-shooterPositionDerivatives[i].x, -shooterPositionDerivatives[i].y, -shooterPositionDerivatives[i].z));
        }
    }

    return displacementDerivatives;
}
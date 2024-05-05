import { Vector3} from 'three';
import { Polynomial, evaluatePolynomial, findStrictlyPositiveRoots } from '@the2innkeeper/polynomial-real-root-finding';
import { computeDisplacementDerivatives } from './MovementUtils';
import { LaurentPolynomial } from './LaurentPolynomial';


export class PhysicsSolver {
    public static expandVelocityNumeratorPolynomial(scaledRelativeVectors: Vector3[]): Polynomial {
        const vectorCoefficientCount = scaledRelativeVectors.length;
        const expandedPolynomialCoefficientCount = 2 * vectorCoefficientCount - 1;
        const expandedPolynomialCoefficients = new Array(expandedPolynomialCoefficientCount).fill(0);

        for (let k = 0; k < expandedPolynomialCoefficientCount; k++) {
            let coefficientSum = 0;
            let middleIndex = Math.floor(k / 2);

            if (k % 2 === 0) {
                for (let j = 0; j < middleIndex; j++) {
                    if (j < scaledRelativeVectors.length && (k - j) < scaledRelativeVectors.length) {
                        coefficientSum += scaledRelativeVectors[j].dot(scaledRelativeVectors[k - j]);
                    }
                }
                coefficientSum *= 2;
                coefficientSum += scaledRelativeVectors[middleIndex].dot(scaledRelativeVectors[middleIndex]);
            } else {
                for (let j = 0; j <= middleIndex; j++) {
                    if (j < scaledRelativeVectors.length && (k - j) < scaledRelativeVectors.length) {
                        coefficientSum += scaledRelativeVectors[j].dot(scaledRelativeVectors[k - j]);
                    }
                }
                coefficientSum *= 2;
            }
            expandedPolynomialCoefficients[k] = coefficientSum;
        }

        return expandedPolynomialCoefficients;
    }

    // Calculate velocity square magnitude as a function of time
    static velocitySquareMagnitude(relativeVectors: Vector3[]): (timeToTarget: number) => number {
        const expandedPolynomial = this.expandVelocityNumeratorPolynomial(relativeVectors);
        return (timeToTarget: number) => evaluatePolynomial(expandedPolynomial, timeToTarget) / (timeToTarget * timeToTarget);
    }

    // Horner's method to calculate initial velocity
    static calculateInitialVelocity(scaledRelativeVectors: Vector3[], timeToTarget: number): Vector3 {
        let hornerResult = scaledRelativeVectors[scaledRelativeVectors.length - 1].clone();
        for (let coeff_i = scaledRelativeVectors.length - 2; coeff_i >= 0; coeff_i--) {
            hornerResult.multiplyScalar(timeToTarget).add(scaledRelativeVectors[coeff_i]);
        }
        return hornerResult.multiplyScalar(1 / timeToTarget);
    }

    // Test points to find minimum using a function
    static testPointsForMinimum(functionToMinimize: (input: number) => number, inputValues: number[]): number {
        let minimumInput = NaN;
        let minimumOutput = Infinity;

        for (let i = 0; i < inputValues.length; i++) {
            const currentInput = inputValues[i];
            const currentOutput = functionToMinimize(currentInput);
            if (currentOutput < minimumOutput) {
                minimumInput = currentInput;
                minimumOutput = currentOutput;
            }
        }

        return minimumInput;
    }

    // Calculate the minimized initial velocity
    static calculateMinimizedInitialVelocity(scaledDeltaSTVectors: Vector3[], scaledDeltaSPVectors: Vector3[]): Vector3 {
        const scaledRelativeVectors = computeDisplacementDerivatives(scaledDeltaSPVectors, scaledDeltaSTVectors);
        
        const velocityNumeratorPolynomial = this.expandVelocityNumeratorPolynomial(scaledRelativeVectors);
        const velocityLaurentPolynomial = new LaurentPolynomial(velocityNumeratorPolynomial).multiplyByXPower(-2);
        
        // Find the numerator of the derivative of the velocity function
        const derivativeNumeratorPolynomial = velocityLaurentPolynomial.derivative().convertToNumeratorPolynomial();

        // Find all roots of the derivative polynomial
        const criticalTimes = findStrictlyPositiveRoots(derivativeNumeratorPolynomial, 1e-6);

        // Test all these critical points into the velocity function to find the minimum critical time
        const velocitySquareMagnitude = this.velocitySquareMagnitude(scaledRelativeVectors);
        const optimalTimeToTarget = this.testPointsForMinimum(velocitySquareMagnitude, criticalTimes);

        // Calculate the initial velocity based on the minimum critical time
        const minimizedInitialVelocity = this.calculateInitialVelocity(scaledRelativeVectors, optimalTimeToTarget);

        // Return the minimum initial velocity
        return minimizedInitialVelocity;
    }
}
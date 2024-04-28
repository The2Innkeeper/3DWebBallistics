// Definition of the LaurentPolynomial class
export class LaurentPolynomial {
    public positiveCoefficients: number[];
    public negativeCoefficients: number[];

    constructor(positiveCoefficients: number[] = [], negativeCoefficients: number[] = []) {
        this.positiveCoefficients = positiveCoefficients;
        this.negativeCoefficients = negativeCoefficients;
    }

   // Evaluate the polynomial using Horner's method
    evaluateAt(x: number): number {
        let posResult = 0;
        for (let i = this.positiveCoefficients.length - 1; i >= 0; i--) {
            posResult = posResult * x + this.positiveCoefficients[i];
        }

        let negResult = 0;
        if (x !== 0) {  // Ensure x is not zero for negative powers
            for (let i = 0; i < this.negativeCoefficients.length; i++) {
                negResult = negResult / x + this.negativeCoefficients[i];
            }
            negResult /= x;  // Final division for the lowest negative power
        }

        return posResult + negResult;
    }

    // Multiply polynomial by a scalar
    multiplyByScalar(scalar: number): LaurentPolynomial {
        return new LaurentPolynomial(
            this.positiveCoefficients.map(coeff => coeff * scalar),
            this.negativeCoefficients.map(coeff => coeff * scalar)
        );
    }

    // Derivative of the polynomial
    derivative(): LaurentPolynomial {
        const posDeriv = this.positiveCoefficients.map((coeff, index) => coeff * index).slice(1);
        const negDeriv = this.negativeCoefficients.map((coeff, index) => -coeff * (index + 1));

        return new LaurentPolynomial(posDeriv, negDeriv);
    }
}
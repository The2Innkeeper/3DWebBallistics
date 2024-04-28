import { VectorControl } from './VectorControl';
import { VectorType } from './types/VectorType';
import * as THREE from 'three';
import { updateScaledDisplacementDerivatives, updateScaledProjectileDerivatives } from '../../simulation/utils/MovementUtils';

class VectorControlManager {
    private vectorControls: Record<VectorType, VectorControl>;
    private vectorValues: Record<VectorType, THREE.Vector3[]> = {
        shooter: [],
        projectile: [],
        target: [],
    };

    constructor() {
        this.vectorControls = {
            shooter: new VectorControl('shooterVectors', 'shooter', 'Shooter Vectors', 3),
            projectile: new VectorControl('projectileVectors', 'projectile', 'Projectile Vectors', 3, 1),
            target: new VectorControl('targetVectors', 'target', 'Target Vectors', 3)
        };

        this.hideAllVectorControls();
    }

    private hideAllVectorControls(): void {
        Object.values(this.vectorControls).forEach(control => control.hide());
    }

    public updateVectorValues(vectorType: VectorType, vectors: THREE.Vector3[]): void {
        this.vectorValues[vectorType] = [...vectors]; // Create a new array to avoid reference issues
        this.updateBackendValues();
    }

    private updateBackendValues(): void {
        const { shooter, projectile, target } = this.vectorValues;
        console.log('Updating backend values with:', this.vectorValues);

        // Update the scaled displacement derivatives
        updateScaledDisplacementDerivatives(target, shooter);

        // Update the scaled projectile derivatives
        updateScaledProjectileDerivatives(projectile);
    }

    public handleVectorTypeChange(selectedType: VectorType): void {
        this.hideAllVectorControls();
        const selectedControl = this.vectorControls[selectedType];
        selectedControl.show();

        if (selectedType === 'projectile' && selectedControl.readOnlyIndex !== null) {
            selectedControl.makeReadOnly(selectedControl.readOnlyIndex);
        }

        selectedControl.render();
    }

    public showInitialVectorControl(initialType: VectorType): void {
        this.vectorControls[initialType].show();
    }

    public getAllVectorValues(): Record<VectorType, THREE.Vector3[]> {
        return {
            shooter: this.vectorControls.shooter.getVectorValues(),
            projectile: this.vectorControls.projectile.getVectorValues(),
            target: this.vectorControls.target.getVectorValues(),
        };
    }
}

export const vectorControlManager = new VectorControlManager();
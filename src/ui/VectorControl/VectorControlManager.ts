import { VectorControl } from './VectorControl';
import { VectorType } from './types/VectorType';
import * as THREE from 'three';
import { updateScaledDisplacementDerivatives } from '../../simulation/utils/MovementUtils';

class VectorControlManager {
    private vectorControls: Record<VectorType, VectorControl>;

    public projectileMinimizedIndex: number = 1;

    constructor() {
        this.vectorControls = {
            target: new VectorControl('targetVectors', 'target', 'Target Vectors', 3, 1),
            shooter: new VectorControl('shooterVectors', 'shooter', 'Shooter Vectors', 3, 1),
            projectile: new VectorControl('projectileVectors', 'projectile', 'Projectile Vectors', 3, 3, this.projectileMinimizedIndex),
        };

        this.hideAllVectorControls();
    }

    private hideAllVectorControls(): void {
        Object.values(this.vectorControls).forEach(control => control.hide());
    }

    public updateBackendValues(): void {
        const { target, shooter, projectile } = this.getAllVectorValues();
        console.log('Updating backend values based on vector values:', target, shooter, projectile);

        // Update the scaled displacement derivatives
        updateScaledDisplacementDerivatives(target, shooter, projectile);
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
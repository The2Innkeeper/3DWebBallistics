import VectorControl from './VectorControl';
import { VectorType } from '../../types/VectorType';
import * as THREE from 'three';
import { eventBus } from '../../communication/EventBus';

class VectorControlManager {
    private vectorControls: Record<VectorType, VectorControl>;

    constructor() {
        this.vectorControls = {
            shooter: new VectorControl('shooterVectors', 'shooter', 'Shooter Vectors', 3),
            projectile: new VectorControl('projectileVectors', 'projectile', 'Projectile Vectors', 3, 1),
            target: new VectorControl('targetVectors', 'target', 'Target Vectors', 3)
        };

        // Hide all vector controls initially
        Object.values(this.vectorControls).forEach(control => control.hide());
    }

    public handleVectorTypeChange(selectedType: VectorType): void {
        // Hide all vector controls
        Object.values(this.vectorControls).forEach(control => control.hide());

        // Show the selected vector control
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

    public notifyVectorUpdate(): void {
        const updatedVectorValues = this.getAllVectorValues();
        // Emit an event using the EventBus
        eventBus.emit('vectorsUpdated', updatedVectorValues);
    }
}

export const vectorControlManager = new VectorControlManager();
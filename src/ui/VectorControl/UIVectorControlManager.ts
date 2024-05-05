import { VectorType, VectorTypes } from './types/VectorType';
import { UIVectorControl } from './UIVectorControl';
import { UIVectorControlFactory } from './UIVectorControlFactory';
import { eventBus } from '../../communication/EventBus';
import { VectorUpdateEvent } from './events/VectorUpdateEvent';
import { updateScaledDisplacementDerivatives } from '../../simulation/utils/MovementUtils';
import * as THREE from 'three';

class UIVectorControlManager {
    private vectorControls: Record<VectorType, UIVectorControl>;

    constructor() {
        // First, create the 'shooter' vector control independently.
        const shooterControl = UIVectorControlFactory.createVectorControl(VectorTypes.Shooter);

        // Now, you can safely use 'shooterControl.getVectorValues()[0]' because 'shooterControl' is already defined.
        this.vectorControls = {
            target: UIVectorControlFactory.createVectorControl(VectorTypes.Target),
            shooter: shooterControl,
            projectile: UIVectorControlFactory.createVectorControl(VectorTypes.Projectile, 3, 3, [0, 1], shooterControl.getVectorValues()[0]),
        };

        this.subscribeToEvents();
        this.hideAllVectorControls();
    }

    private subscribeToEvents(): void {
        eventBus.subscribe(VectorUpdateEvent, this.handleVectorUpdate.bind(this));
    }

    private handleVectorUpdate(event: VectorUpdateEvent): void {
        console.log(`Updating backend values for ${event.vectorType} vectors:`, event.vectors);
        this.updateBackendValues();
    }

    private hideAllVectorControls(): void {
        Object.values(this.vectorControls).forEach(control => control.hide());
    }

    private updateBackendValues(): void {
        const vectors = this.getAllVectorValues();
        updateScaledDisplacementDerivatives(vectors.target, vectors.shooter, vectors.projectile);
    }

    public handleVectorTypeChange(selectedType: VectorType): void {
        this.hideAllVectorControls();
        const selectedControl = this.vectorControls[selectedType];
        selectedControl.show();
    }

    public showInitialVectorControl(): void {
        this.hideAllVectorControls();
        this.vectorControls.target.show();
    }

    public getAllVectorValues(): Record<VectorType, THREE.Vector3[]> {
        return {
            shooter: this.vectorControls.shooter.getVectorValues(),
            projectile: this.vectorControls.projectile.getVectorValues(),
            target: this.vectorControls.target.getVectorValues(),
        };
    }
}

export const vectorControlManager = new UIVectorControlManager();

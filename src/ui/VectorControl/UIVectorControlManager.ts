import { UIVectorType, UIVectorTypes } from './types/VectorType';
import { UIVectorControl } from './UIVectorControl';
import { UIVectorControlFactory } from './UIVectorControlFactory';
import { eventBus } from '../../communication/EventBus';
import { VectorUpdateEvent as UIVectorUpdateEvent } from './events/UIVectorUpdateEvent';
import { updateScaledDisplacementDerivatives } from '../../simulation/utils/MovementUtils';
import * as THREE from 'three';

class UIVectorControlManager {
    private vectorControls: Record<UIVectorType, UIVectorControl>;

    constructor() {
        // First, create the 'shooter' vector control independently.
        const shooterControl = UIVectorControlFactory.createVectorControl(UIVectorTypes.Shooter);

        // Now, you can safely use 'shooterControl.getVectorValues()[0]' because 'shooterControl' is already defined.
        this.vectorControls = {
            target: UIVectorControlFactory.createVectorControl(UIVectorTypes.Target),
            shooter: shooterControl,
            projectile: UIVectorControlFactory.createVectorControl(UIVectorTypes.Projectile, 3, 3, [0, 1], shooterControl.getVectorValues()[0]),
        };

        this.subscribeToEvents();
        this.hideAllVectorControls();
    }

    private subscribeToEvents(): void {
        eventBus.subscribe(UIVectorUpdateEvent, this.handleVectorUpdate.bind(this));
    }

    private handleVectorUpdate(event: UIVectorUpdateEvent): void {
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

    public handleVectorTypeChange(selectedType: UIVectorType): void {
        this.hideAllVectorControls();
        const selectedControl = this.vectorControls[selectedType];
        selectedControl.show();
    }

    public showInitialVectorControl(): void {
        this.hideAllVectorControls();
        this.vectorControls.target.show();
    }

    public getAllVectorValues(): Record<UIVectorType, THREE.Vector3[]> {
        return {
            shooter: this.vectorControls.shooter.getVectorValues(),
            projectile: this.vectorControls.projectile.getVectorValues(),
            target: this.vectorControls.target.getVectorValues(),
        };
    }
}

export const vectorControlManager = new UIVectorControlManager();

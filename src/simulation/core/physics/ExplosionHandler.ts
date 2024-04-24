import * as THREE from 'three';
import { eventBus } from '../../../communication/EventBus';

export class ExplosionHandler {
    constructor() {
        eventBus.on('collision', this.handleExplosion.bind(this));
    }

    private handleExplosion(data: { position: THREE.Vector3 }): void {
        console.log('Explosion at:', data.position);
        // Implement explosion effects here
    }
}
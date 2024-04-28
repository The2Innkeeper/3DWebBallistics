import * as THREE from 'three';
import { eventBus } from '../../../communication/EventBus';
import { CollisionEvent } from '../../../communication/events/entities/CollisionEvent';

export class ExplosionHandler {
    constructor() {
        eventBus.subscribe(CollisionEvent, this.handleExplosion.bind(this));
    }

    private handleExplosion(data: { position: THREE.Vector3 }): void {
        console.log('Explosion at:', data.position);
        // Implement explosion effects here
    }
}
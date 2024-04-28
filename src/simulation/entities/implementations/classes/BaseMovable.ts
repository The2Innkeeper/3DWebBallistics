import * as THREE from 'three';
import { eventBus } from '../../../../communication/EventBus';
import { FrameUpdateEvent } from '../../../../communication/events/FrameUpdateEvent';
import { Entity } from './Entity';
import { IMovable } from '../../interfaces/IMovable';

export abstract class BaseMovable extends Entity implements IMovable {
    public lifeTime: number = 0;
    protected scaledPositionDerivatives!: readonly THREE.Vector3[];
    readonly expiryLifeTime: number;
    readonly expiryDistance: number;

    constructor(position: THREE.Vector3, radius: number, expiryLifetime: number = 20, expiryDistance: number = 1000) {
        super(position, radius);
        this.expiryLifeTime = expiryLifetime;
        this.expiryDistance= expiryDistance;
        this.registerUpdate();
    }

    isExpired(): boolean {
        return this.lifeTime > this.expiryLifeTime || this.position.lengthSq() > this.expiryDistance ** 2;
    }

    abstract updatePosition(deltaTime: number): void;
    

    private onFrameUpdate(event: FrameUpdateEvent) {
        const deltaTime = event.deltaTime;
        this.updatePosition(deltaTime);
        this.lifeTime += deltaTime;
        this.updateMesh();
    }

    private registerUpdate() {
        // Ensure that deltaTime is passed to updatePosition when the 'update' event is emitted
        eventBus.subscribe(FrameUpdateEvent, this.onFrameUpdate.bind(this));
    }

    protected evaluatePositionAt(time: number): THREE.Vector3 {
        let position = new THREE.Vector3(0, 0, 0);
        for (let i = this.scaledPositionDerivatives.length - 1; i >= 0; i--) {
            position.multiplyScalar(time).add(this.scaledPositionDerivatives[i]);
        }
        return position;
    }

    public getScaledPositionDerivatives(): readonly THREE.Vector3[] {
        return this.scaledPositionDerivatives;
    }
}
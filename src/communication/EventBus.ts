import { EventEmitter } from './EventEmitter';

export class EventBus {
    private emitters: Map<Function, EventEmitter<any>> = new Map();

    emit<T>(eventType: Function, event: T): void {
        const emitter = this.emitters.get(eventType);
        if (emitter) {
        emitter.emit(event);
        }
    }

    subscribe<T>(eventType: Function, callback: EventCallback<T>): void {
        if (!this.emitters.has(eventType)) {
        this.emitters.set(eventType, new EventEmitter<T>());
        }
        this.emitters.get(eventType)!.subscribe(callback);
    }

    unsubscribe<T>(eventType: Function, callback: EventCallback<T>): void {
        const emitter = this.emitters.get(eventType);
        if (emitter) {
        emitter.unsubscribe(callback);
        }
    }
}

export const eventBus = new EventBus();
export class EventEmitter<T> {
    private listeners: EventCallback<T>[] = [];

    emit(event: T): void {
        for (const listener of this.listeners) {
        listener(event);
        }
    }

    subscribe(listener: EventCallback<T>): void {
        this.listeners.push(listener);
    }

    unsubscribe(listener: EventCallback<T>): void {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
        this.listeners.splice(index, 1);
        }
    }
}
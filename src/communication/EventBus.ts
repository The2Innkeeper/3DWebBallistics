export class EventBus {
    private listeners: { [key: string]: Function[] } = {};

    public on(event: string, listener: Function): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(listener);
    }

    public emit(event: string, data?: any): void {
        if (this.listeners[event]) {
            this.listeners[event].forEach(listener => listener(data));
        }
    }
}

export const eventBus = new EventBus();

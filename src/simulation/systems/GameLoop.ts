// GameLoop.ts
import { eventBus } from '../../communication/EventBus';
import { frameUpdateEvent, FrameUpdateEvent } from '../../communication/events/FrameUpdateEvent';

export class GameLoop {
  private lastTime: number = 0;

  start(): void {
    this.lastTime = performance.now();
    this.update();
  }

  private update(): void {
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;
    frameUpdateEvent.deltaTime = deltaTime;

    // Emit the frame update event
    eventBus.emit(FrameUpdateEvent, frameUpdateEvent);
    // console.log('Frame update event emitted with deltaTime:', frameUpdateEvent.deltaTime);

    // Schedule the next update
    requestAnimationFrame(this.update.bind(this));
  }
}

export const gameLoop = new GameLoop();

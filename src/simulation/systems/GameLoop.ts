// GameLoop.ts
import { eventBus } from '../../communication/EventBus';
import { frameUpdateEvent, FrameUpdateEvent } from '../../communication/events/FrameUpdateEvent';

export class GameLoop {
  private lastTime: number = 0;
  private accumulator: number = 0;

  start(): void {
    this.lastTime = performance.now();
    this.update();
  }

  private update(): void {
    const fixedDeltaTime = 1 / 60;
    const currentTime = performance.now();
    this.accumulator += (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    while (this.accumulator >= fixedDeltaTime) {
      // Emit the frame update event with fixed delta time
      eventBus.emit(FrameUpdateEvent, fixedDeltaTime);
      this.accumulator -= fixedDeltaTime;
    }

    requestAnimationFrame(this.update.bind(this));
  }
}

export const gameLoop = new GameLoop();

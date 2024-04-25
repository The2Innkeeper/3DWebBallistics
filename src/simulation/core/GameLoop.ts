// GameLoop.ts
import { eventBus } from '../../communication/EventBus';

class GameLoop {
  private lastTime: number = 0;

  start() {
    this.lastTime = performance.now();
    requestAnimationFrame(this.update.bind(this));
  }

  private update(currentTime: number) {
    const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;
    eventBus.emit('update', deltaTime);

    // Schedule the next update
    requestAnimationFrame(this.update.bind(this));
  }
}

export const gameLoop = new GameLoop();

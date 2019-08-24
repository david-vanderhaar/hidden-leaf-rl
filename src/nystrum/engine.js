import * as Helper from '../helper';

export class Engine {
  constructor() {
    this.actors = [];
    this.currentActor = 0;
    this.isRunning = false;
  }

  async process() {
    let actor = this.actors[this.currentActor]
    actor.gainEnergy(actor.speed);
    if (actor.hasEnoughEnergy()) {
      let action = actor.getAction(actor);
      if (!action) { return false; } // if no action given, kick out to UI input
      while (true) {
        await Helper.delay(1000);
        let result = action.perform();
        if (!result.success) return false;
        if (result.alternative === null) break;
        action = result.alternative;
      }
    }
    this.currentActor = (this.currentActor + 1) % this.actors.length;
    return true
  }

  async start() {
    this.isRunning = true;
    let i = 0
    while (this.isRunning) {
      this.isRunning = await this.process();
    }
    // invoke UI input here, it should set next action of Hero and start() engine again.
  }

  stop() {
    this.isRunning = false;
  }
}
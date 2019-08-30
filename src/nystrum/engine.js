import * as Helper from '../helper';

export class Engine {
  constructor() {
    this.actors = [];
    this.currentActor = 0;
    this.isRunning = false;
    this.game = null;
  }

  async processV1 () { // a turn-based system using speed and round-robin
    let actor = this.actors[this.currentActor]
    actor.gainEnergy(actor.speed);
    if (actor.hasEnoughEnergy()) {
      let action = actor.getAction(this.game);
      if (!action) { return false; } // if no action given, kick out to UI input
      while (true) {
        let result = action.perform();
        this.game.draw();
        await Helper.delay(action.processDelay);
        if (!result.success) return false;
        if (result.alternative === null) break;
        action = result.alternative;
      }
    }
    this.currentActor = (this.currentActor + 1) % this.actors.length;
    return true
  }

  async process() { // a turn-based system using speed and Action Points
    let actor = this.actors[this.currentActor]
    let acting = true;
    while (acting) {
      if (actor.hasEnoughEnergy()) {
        let action = actor.getAction(this.game);
        if (!action) { return false; } // if no action given, kick out to UI input
        while (true) {
          let result = action.perform();
          this.game.draw();
          await Helper.delay(action.processDelay);
          if (!result.success) return false;
          if (result.alternative === null) break;
          action = result.alternative;
        }
      } else {
        actor.gainEnergy(actor.speed);
        acting = false;
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
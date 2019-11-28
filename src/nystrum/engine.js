import * as Helper from '../helper';

export class Engine {
  constructor({
    statusEffects = [],
    actors = [],
    currentActor = 0,
    isRunning = false,
    game = null,
  }) {
    this.statusEffects = statusEffects;
    this.actors = actors;
    this.currentActor = currentActor;
    this.isRunning = isRunning;
    this.game = game;
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
      let timePassed = 0;
      if (actor.hasEnoughEnergy()) {
        let action = actor.getAction(this.game);
        if (!action) { return false; } // if no action given, kick out to UI input
        timePassed += action.energyCost;
        while (true) {
          let result = await action.perform();
          this.game.draw();
          await Helper.delay(action.processDelay);
          if (!result.success) return false;
          if (result.alternative === null) break;
          action = result.alternative;
        }
        this.processStatusEffects(timePassed);
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
    while (this.isRunning) {
      this.isRunning = await this.process();

    }
    let actor = this.actors[this.currentActor]
    if (actor.keymap) {
      this.game.visibleKeymap = actor.keymap;
    }
    await this.game.updateReact(this.game);
  }
  
  stop() {
    this.isRunning = false;
  }

  addStatusEffect(newEffect) {
    if (!newEffect.allowDuplicates) {
      if (this.statusEffects.filter((effect) => (
        effect.actor.id === newEffect.actor.id &&
        effect.name === newEffect.name
      )).length > 0) {
        console.log(`${newEffect.name} cannot be applied twice to ${newEffect.actor.name}`);
        return false;
      };
    }
    newEffect.onStart();
    this.statusEffects.push(newEffect)
    return true;
  }

  removeStatusEffectById (id) {
    this.statusEffects = this.statusEffects.filter((effect) => {
      if (effect.id !== id) return true;
      effect.onStop();
      return false;
    });
  }

  removeDeadStatusEffects() {
    this.statusEffects = this.statusEffects.filter((effect) =>{
      if (effect.lifespan >= 0 && effect.timeToLive <= 0) {
        effect.onStop();
        return false;
      }
      return true;
    });
  }

  processStatusEffects (timePassed) {
    this.statusEffects.forEach((effect) => {
      effect.timeSinceLastStep += timePassed;
      effect.timeToLive -= timePassed;
      if (effect.timeSinceLastStep >= effect.stepInterval) {
        effect.onStep();
        effect.timeSinceLastStep = 0;
      } 
    });
    this.removeDeadStatusEffects();
  }
}

export class CrankEngine extends Engine {
  async process() { // a turn-based system using speed and Action Points
    let actor = this.actors[this.currentActor]
    let acting = true;
    while (acting) {
      if (actor.hasEnoughEnergy()) {
        let action = actor.getAction(this.game);
        if (!action) { return false; } // if no action given, kick out to UI input
        while (true) {
          let result = await action.perform();
          this.game.draw();
          // await Helper.delay(action.processDelay);
          if (!result.success) return false;
          if (result.alternative === null) break;
          action = result.alternative;
        }
      } else {
        // actor.gainEnergy(actor.speed);
        acting = false;
      }
    }
    // this.currentActor = (this.currentActor + 1) % this.actors.length;
    this.currentActor += 1;
    if (this.currentActor + 1 >= this.actors.length) {
      this.currentActor = 0;
      this.actors.forEach((actor) => actor.gainEnergy(actor.speed));
      return false;
    }
    return true
  }
}
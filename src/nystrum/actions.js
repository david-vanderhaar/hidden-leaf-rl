import * as Helper from '../helper';
import * as Action from './actions';
import * as Constant from './constants';

export class Base {
  constructor({game, actor, energyCost = 100, processDelay = 50}) {
    this.actor = actor
    this.game = game
    this.energyCost = energyCost
    this.processDelay = processDelay
  }

  perform() {
    console.log(`${this.actor.name} performs`)
    this.actor.energy -= this.energyCost;
    return {
      success: true,
      alternative: null,
    }
  }
}

export class Say extends Base {
  constructor({ message, processDelay = 0, ...args}) {
    super({...args});
    this.message = message
    this.processDelay = processDelay
  }
  perform() {
    console.log(`${this.actor.name} says ${this.message}`);
    this.actor.energy -= this.energyCost;
    return {
      success: true,
      alternative: null,
    }
  }
};

export class DestroySelf extends Base {
  constructor({processDelay = 0, ...args}) {
    super({...args});
    this.processDelay = processDelay
  }
  perform() {
    console.log(`${this.actor.name} is self-destructing`);
    this.actor.energy -= this.energyCost;
    this.actor.destroy();
    return {
      success: true,
      alternative: null,
    }
  }
};

export class Move extends Base {
  constructor({ targetPos, processDelay = 25, ...args}) {
    super({...args});
    this.targetPos = targetPos
    this.processDelay = processDelay
  }
  perform() {
    let success = false;
    let alternative = null;
    if (this.game.canOccupyPosition(this.targetPos)) {
      let tile = this.game.map[Helper.coordsToString(this.actor.pos)]
      this.game.map[Helper.coordsToString(this.actor.pos)] = { ...tile, entities: tile.entities.filter((e) => e.id !== this.actor.id) }
      this.actor.pos = this.targetPos
      this.game.map[Helper.coordsToString(this.targetPos)].entities.push(this.actor);
      this.actor.energy -= this.energyCost;
      success = true;
    } else {
      success = true;
      alternative = new Action.Say({
        message: `Ooh I can\'t move there!`, 
        game: this.game, 
        actor: this.actor, 
        energyCost: Constant.ENERGY_THRESHOLD
      })
    }

    return {
      success,
      alternative,
    }
  }
};
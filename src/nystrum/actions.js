import * as Helper from '../helper';
import * as Action from './actions';
import * as Constant from './constants';

export class Base {
  constructor({game, actor, energyCost}) {
    this.actor = actor
    this.game = game
    this.energyCost = energyCost
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
  constructor({message, ...args}) {
    super({...args});
    this.message = message
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

export class Move extends Base {
  constructor({targetPos, ...args}) {
    super({...args});
    this.targetPos = targetPos
  }
  perform() {
    let success = false;
    let alternative = null;
    if (this.game.canOccupyPosition(this.targetPos)) {
      let tile = this.game.map[Helper.coordsToString(this.actor.pos)]
      this.game.map[Helper.coordsToString(this.actor.pos)] = { ...tile, entities: [] }
      let nextTile = this.game.map[Helper.coordsToString(this.targetPos)]
      this.actor.pos = this.targetPos
      nextTile.entities.push(this.actor);
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
import uuid from 'uuid/v1';
import pipe from 'lodash/fp/pipe';
import * as Helper from '../helper';
import * as Constant from './constants';
import * as Action from './actions';

export class Entity {
  constructor() {
    let id = uuid();
    this.id = id;
    this.game = null;
  }
}

const Acting = superclass => class extends superclass {
  constructor({name, actions, speed, energy, ...args}) {
    super({...args})
    this.name = name;
    this.actions = actions;
    this.speed = speed;
    this.energy = energy;
    this.energyThreshold = Constant.ENERGY_THRESHOLD;
  }

  getAction() {
    let action = Helper.getRandomInArray(this.actions)
    if (action) { return action }
  }

  gainEnergy(value) {
    this.energy += value;
  }

  hasEnoughEnergy() {
    return this.energy >= this.energyThreshold;
  }
}

const Rendering = superclass => class extends superclass {
  constructor({pos = {x: 0, y: 0}, renderer, ...args}) {
    super({...args})
    this.pos = pos;
    this.renderer = {...renderer};
  }

  getPosition () {
    return this.pos;
  }
}

const Playing = superclass => class extends superclass {
  constructor({...args}) {
    super({...args})
    this.nextAction = null;
  }

    setNextAction(action) {
      this.nextAction = action;
    }

    getAction() {
      let action = this.nextAction;
      this.nextAction = null;
      return action;
    }
}

const Moving = superclass => class extends superclass {
  constructor({...args}) {
    super({...args})
  }

  getAction(game) {
    let result = new Action.Move({
      targetPos: { x: this.pos.x + 1, y: this.pos.y }, 
      game, 
      actor: this, 
      energyCost: Constant.ENERGY_THRESHOLD
    });
    return result;
  }
}

const Destructable = superclass => class extends superclass {
  constructor({durability = 1, ...args }) {
    super({ ...args })
    this.durability = durability;
  }

  decreaseDurability (value) {
    this.durability -= value
    if (this.durability <= 0) {
      this.destroy();
    }
  }

  increaseDurability (value) {
    this.durability += value
  }

  destroy () {
    let tile = this.game.map[Helper.coordsToString(this.pos)];
    this.game.map[Helper.coordsToString(this.pos)].entities = tile.entities.filter((e) => e.id !== this.id);
    this.game.engine.actors = this.game.engine.actors.filter((e) => e.id !== this.id);
    this.game.engine.currentActor = 0;
    this.game.draw()
  }
}

export const Actor = pipe(Acting, Rendering)(Entity);
export const Mover = pipe(Acting, Rendering, Moving)(Entity);
export const Player = pipe(Acting, Rendering, Destructable, Playing)(Entity);
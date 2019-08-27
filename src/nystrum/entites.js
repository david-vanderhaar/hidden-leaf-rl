import uuid from 'uuid/v1';
import pipe from 'lodash/fp/pipe';
import * as Helper from '../helper';
import * as Constant from './constants';
import * as Action from './actions';
import * as ROT from 'rot-js';

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
    this.energy = 0;
  }

  getAction() {
    let action = Helper.getRandomInArray(this.actions)
    if (action) { return action }
  }

  gainEnergy(value) {
    this.energy += value;
  }

  hasEnoughEnergy() {
    return this.energy >= 0;
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

const Chasing = superclass => class extends superclass {
  constructor({targetEntity = null ,...args}) {
    super({...args})
    this.targetEntity = targetEntity;
  }

  calculatPath () {
    let map = this.game.map
    let isPassable = function (x, y) {
      if (map[x + "," + y]) {
        return (map[x + "," + y].type === 'GROUND');
      } else {
        return false
      }
    }
    let astar = new ROT.Path.AStar(this.targetEntity.pos.x, this.targetEntity.pos.y, isPassable, {topology: 4});
    let path = [];
    astar.compute(this.pos.x, this.pos.y, function (x, y) {
      path.push({x, y})
    });

    return path.length > 1 ? path[1] : this.pos;
  }

  getAction(game) {
    let targetPos = this.calculatPath();
    let result = new Action.Move({
      targetPos, 
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
export const Chaser = pipe(Acting, Rendering, Chasing)(Entity);
export const Player = pipe(Acting, Rendering, Destructable, Playing)(Entity);
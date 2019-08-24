import uuid from 'uuid/v1';
import pipe from 'lodash/fp/pipe';
import * as Helper from '../helper';
import * as Constant from './constants';
import * as Action from './actions';

export class Base {
  constructor() {
    let id = uuid();
    this.id = id;
  }
}

const Acting = superclass => class extends superclass {
  constructor(name, actions, speed, energy, ...args) {
    super(...args)
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

export const Actor = pipe(Acting)(Base);

const Moving = superclass => class extends superclass {
  constructor(pos = {x: 0, y: 0}, ...args) {
    super(...args)
    console.log(args);
    this.actions.push(new Action.Say('move!', null, this, Constant.ENERGY_THRESHOLD))
    this.pos = pos;
  }
}

export const Mover = pipe(Acting, Moving)(Base);
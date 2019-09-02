import uuid from 'uuid/v1';
import pipe from 'lodash/fp/pipe';
import * as Helper from '../helper';
import * as Constant from './constants';
import * as Action from './actions';
import * as ROT from 'rot-js';

export class Entity {
  constructor({ game = null, passable = false}) {
    let id = uuid();
    this.id = id;
    this.game = game;
    this.passable = passable;
  }
}

const Acting = superclass => class extends superclass {
  constructor({name, actions, speed, energy = 0, ...args}) {
    super({...args})
    this.name = name;
    this.actions = actions;
    this.speed = speed;
    this.energy = speed;
  }

  getAction() {
    let action = Helper.getRandomInArray(this.actions)
    if (action) { return action }
  }

  gainEnergy(value) {
    this.energy += value;
  }

  hasEnoughEnergy() {
    return this.energy > 0;
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

const Containing = superclass => class extends superclass {
  constructor({container = [], ...args}) {
    super({...args})
    this.container = container;
  }

  contains (itemType) {
    let container = this.container;
    let items = container.filter((item) => item.name === itemType);
    return items.length > 0 ? items[0] : false;
  }

  addToContainer (item) {
    this.container.push(item);
  }
  
  removeFromContainer (item) {
    this.container = this.container.filter((it) => it.id !== item.id);
  }
}

const Equiping = superclass => class extends superclass {
  constructor({equiment = Constant.EQUIPMENT_LAYOUTS.human(), ...args}) {
    super({...args})
    this.equiment = equiment;
  }

  equip (slotName, item) {
    let slot = this.equiment.find((slot) => slot.name === slotName);
    if (slot.item) {
      this.unequip(slot.name, slot.item);
      this.equiment = this.equiment.map((equipmentSlot) => {
        if (equipmentSlot.name === slotName) {
          equipmentSlot.item = item;
        }
        return equipmentSlot;
      })
    }
  }
  
  unequip(slotName) {
    this.equiment = this.equiment.map((slot) => {
      if (slot.name === slotName) {
        slot.item = null;
      }
      return slot;
    })
  }
}

const Charging = superclass => class extends superclass {
  constructor({charge = 10, ...args}) {
    super({...args})
    this.charge = charge;
    this.chargeMax = charge;
  }

  decreaseCharge(value) {
    this.charge = Math.max(0, this.charge - value);
  }
  
  increaseCharge(value) {
    this.charge = Math.min(this.chargeMax, this.charge + value);
  }
}

const Signing = superclass => class extends superclass {
  constructor({...args}) {
    super({...args})
    this.signHistory = [];
  }

  addSign(sign) {
    if (this.signHistory.length >= 4) {
      this.signHistory.shift();
    }
    this.signHistory.push(sign);
  }
  
  clearSigns() {
    this.signHistory = [];
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

const Projecting = superclass => class extends superclass {
  constructor({path = [], targetPos = null ,...args}) {
    super({...args})
    this.path = path;
    this.targetPos = targetPos;
  }

  createPath (game) {
    let path = Helper.calculatePath(game, this.targetPos, this.pos, 8);
    this.path = path;
  }

  getAction(game) {
    let targetPos = this.path.length > 0 ? this.path[0] : this.pos;
    let result = new Action.Move({
      targetPos, 
      game, 
      actor: this, 
      energyCost: Constant.ENERGY_THRESHOLD
    });
    if (this.game.canOccupyPosition(targetPos)) {
      this.path.shift();
    }
    return result;
  }
}

const DestructiveProjecting = (superclass) => class extends superclass {
  constructor({path = [], targetPos = null, attackDamage = 1, range = 3, ...args}) {
    super({...args})
    this.path = path;
    this.targetPos = targetPos;
    this.attackDamage = attackDamage;
    this.range = range;
  }

  createPath (game) {
    let path = Helper.calculatePathWithRange(game, this.targetPos, this.pos, 8, this.range);
    this.path = path;
  }

  getAction (game) {
    let targetPos = this.path.length > 0 ? this.path[0] : this.pos;
    
    let result = new Action.ThrowDestructable({
      targetPos, 
      game, 
      actor: this, 
      energyCost: Constant.ENERGY_THRESHOLD
    });

    return result;
  }
}

const Chasing = superclass => class extends superclass {
  constructor({targetEntity = null ,...args}) {
    super({...args})
    this.targetEntity = targetEntity;
  }

  getAction(game) {
    let path = Helper.calculatePath(game, this.targetEntity.pos, this.pos);
    let targetPos = path.length > 0 ? path[0] : this.pos;

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
    this.energy = 0;
    let tile = this.game.map[Helper.coordsToString(this.pos)];
    this.game.map[Helper.coordsToString(this.pos)].entities = tile.entities.filter((e) => e.id !== this.id);
    this.game.engine.actors = this.game.engine.actors.filter((e) => e.id !== this.id);
    this.game.engine.currentActor = 0;
    this.game.draw()
  }
  
  // destroyV2 () {
  //   for (let key in this.game.map) {
  //     if (this.game.map[key].entities.length > 0) {
  //       this.game.map[key].entities = this.game.map[key].entities.filter((e) => {
  //         return (e.id !== this.id)
  //       });
  //     }
  //   }
  //   this.game.engine.actors = this.game.engine.actors.filter((e) => e.id !== this.id);
  //   this.game.engine.currentActor = 0;
  //   this.game.draw()
  // }
}

export const Actor = pipe(Acting, Rendering)(Entity);
export const Chaser = pipe(Acting, Rendering, Chasing, Destructable)(Entity);
export const Player = pipe(Acting, Rendering, Destructable, Charging, Signing, Containing, Playing)(Entity);

export const DestructiveProjectile = pipe(Acting, Rendering, DestructiveProjecting, Destructable)(Entity);
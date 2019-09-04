import uuid from 'uuid/v1';
import pipe from 'lodash/fp/pipe';
import * as Helper from '../helper';
import * as Constant from './constants';
import * as Action from './actions';

export class Entity {
  constructor({ game = null, passable = false}) {
    let id = uuid();
    this.entityTypes = ['Entity']
    this.id = id;
    this.game = game;
    this.passable = passable;
  }
}

export const Attacking = superclass => class extends superclass {
  constructor({attackDamage = 1, ...args }) {
    super({ ...args })
    this.entityTypes = this.entityTypes.concat('ATTACKING')
    this.attackDamage = attackDamage;
  }

  getAttackDamage (additional = 0) {
    return this.attackDamage + additional;
  }
}

export const Equipable = superclass => class extends superclass {
  constructor({name = 'nameless', equipmentType = Constant.EQUIPMENT_TYPES.HAND, ...args }) {
    super({ ...args })
    this.entityTypes = this.entityTypes.concat('EQUIPABLE')
    this.name = name;
    this.equipmentType = equipmentType;
  }
}

const Acting = superclass => class extends superclass {
  constructor({name, actions = [], speed, energy = 0, ...args}) {
    super({...args})
    this.entityTypes = this.entityTypes.concat('ACTING')
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
    this.entityTypes = this.entityTypes.concat('RENDERING')
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
    this.entityTypes = this.entityTypes.concat('CONTAINING')
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
  constructor({equipment = Constant.EQUIPMENT_LAYOUTS.human(), ...args}) {
    super({...args})
    this.entityTypes = this.entityTypes.concat('EQUIPING')
    this.equipment = equipment;
  }

  getItemInSlot (slotName) {
    let openSlots = this.equipment.filter((slot) => {
      return (slot.item === null && slot.type === slotName)
    })
    if (openSlots.length > 0) { return false; }
    let slot = this.equipment.find((slot) => slot.type === slotName);
    if (!slot) { return false; }
    if (!slot.item) { return false; }
    return slot.item;
  }

  equip (slotName, item) {
    let foundSlot = false;
    this.equipment = this.equipment.map((slot) => {
      if (!foundSlot && slot.type === slotName && slot.item === null) {
        slot.item = item;
        foundSlot = true;
      }
      return slot;
    })
  }
  
  unequip(item) {
    this.equipment = this.equipment.map((slot) => {
      if (slot.item) {
        if (slot.item.id === item.id) {
          slot.item = null;
        }
      }
      return slot;
    })
  }
}

const Charging = superclass => class extends superclass {
  constructor({charge = 10, ...args}) {
    super({...args})
    this.entityTypes = this.entityTypes.concat('CHARGING')
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
    this.entityTypes = this.entityTypes.concat('SIGNING')
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
    this.entityTypes = this.entityTypes.concat('PLAYING')
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
    this.entityTypes = this.entityTypes.concat('PROJECTING')
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

const DestructiveProjecting = superclass => class extends superclass {
  constructor({path = [], targetPos = null, attackDamage = 1, range = 3, ...args}) {
    super({...args})
    this.entityTypes = this.entityTypes.concat('DESTRUCTIVE_PROJECTING')
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
    this.entityTypes = this.entityTypes.concat('CHASING')
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
    this.entityTypes = this.entityTypes.concat('DESTRUCTABLE')
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
export const Player = pipe(Acting, Rendering, Destructable, Charging, Signing, Containing, Equiping, Attacking, Playing)(Entity);

export const Weapon = pipe(Rendering, Equipable, Attacking)(Entity);
export const DestructiveProjectile = pipe(Acting, Rendering, DestructiveProjecting, Destructable)(Entity);
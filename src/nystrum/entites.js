import uuid from 'uuid/v1';
import pipe from 'lodash/fp/pipe';
import * as Helper from '../helper';
import * as Constant from './constants';
import * as Action from './actions';
import * as Engine from './engine';
import { cloneDeep, cloneDeepWith } from 'lodash';

export class Entity {
  constructor({ game = null, passable = false}) {
    let id = uuid();
    this.entityTypes = ['Entity']
    this.id = id;
    this.game = game;
    this.passable = passable;
  }
}

const Parent = superclass => class extends superclass {
  constructor({ children = [], engine = new Engine.CrankEngine({}), ...args }) {
    super({...args })
    this.entityTypes = this.entityTypes.concat('PARENT');
    this.children = children;
    this.engine = engine;
    this.isInitialized = false;
  }

  destroyChild(child) {
    child.energy = 0;
    let tile = this.game.map[Helper.coordsToString(child.pos)];
    this.game.map[Helper.coordsToString(child.pos)].entities = tile.entities.filter((e) => e.id !== child.id);
    this.engine.actors = this.engine.actors.filter((e) => e.id !== child.id);
    // this.game.engine.currentActor = 0;
    this.game.draw()
  }

  canAttack (entity) {
    const childIds = this.children.map((child) => child.id); 
    return !childIds.includes(entity.id)
  }
  
  initialize() {
    this.isInitialized = true;
    this.engine.game = this.game;
    this.engine.actors = this.children;
    this.engine.actors.forEach((actor) => {
      actor.game = this.game;
      actor.destroy = () => {this.destroyChild(actor)};
      actor.canAttack = this.canAttack.bind(this);
      // actor.canAttack = (entity) => {this.canAttack(entity)};
      this.game.addActor(actor, this.engine);
    });
  }

  getAction(game) {
    // crank engine one turn
    if (!this.isInitialized) {
      this.initialize()
    }

    let result = new Action.CrankEngine({
      game,
      actor: this,
      engine: this.engine,
      energyCost: Constant.ENERGY_THRESHOLD,
    });

    return result;
  }

}

const UI = superclass => class extends superclass {
  constructor({ initiatedBy = null, ...args }) {
    super({...args })
    this.entityTypes = this.entityTypes.concat('UI');
    this.initiatedBy = initiatedBy;
    this.active = true;
  }

  hasEnoughEnergy() {
    return this.active;
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

  canAttack (entity) {
    return true;
  }

  attack (targetPos) {
    let success = false;
    let tile = this.game.map[Helper.coordsToString(targetPos)]
    if (!tile) { return success }
    let targets = Helper.getDestructableEntities(tile.entities);
    if (targets.length > 0) {
      let target = targets[0];
      if (this.canAttack(target)) {
        let damage = this.getAttackDamage();
        if (this.entityTypes.includes('EQUIPING')) {
          this.equipment.map((slot) => {
            if (slot.item) {
              if (slot.item.entityTypes.includes('ATTACKING')) {
                damage += slot.item.getAttackDamage();
              }
            }
          });
        }
        console.log(`${this.name} does ${damage} to ${target.name}`);
        target.decreaseDurability(damage);
        success = true;
      }
    }

    return success;
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

  gainEnergy(value = this.speed) {
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
  constructor({keyMap = {}, ...args}) {
    super({...args})
    this.entityTypes = this.entityTypes.concat('PLAYING')
    this.nextAction = null;
    this.keyMap = keyMap;
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
  constructor({path = false, targetPos = null ,...args}) {
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
    if (!this.path) {
      this.createPath(game);
    }
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
  constructor({path = false, targetPos = null, attackDamage = 1, range = 3, ...args}) {
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
    if (!this.path) {
      this.createPath(game);
    }

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

const GaseousDestructiveProjecting = superclass => class extends superclass {
  constructor({owner_id = null, path = false, targetPos = null, attackDamage = 1, range = 3, ...args}) {
    super({...args})
    this.entityTypes = this.entityTypes.concat('GASEOUS_DESTRUCTIVE_PROJECTING')
    this.path = path;
    this.targetPos = targetPos;
    this.attackDamage = attackDamage;
    this.range = range;
    this.owner_id = owner_id;
  }

  canAttack (entity) {
    let success = super.canAttack();
    if (success) {
      success = this.owner_id === null || (entity.owner_id !== this.owner_id);
    }
    return success
  }

  createPath (game) {
    let path = Helper.calculatePathWithRange(game, this.targetPos, this.pos, 8, this.range);
    this.path = path;
  }

  getAction (game) {
    if (!this.path) {
      this.createPath(game);
    }
    let targetPos = this.path.length > 0 ? this.path[0] : this.pos;
    
    let result = new Action.ThrowDestructableGas({
      targetPos, 
      game, 
      actor: this, 
      energyCost: Constant.ENERGY_THRESHOLD
    });

    return result;
  }
}

const Gaseous = superclass => class extends superclass {
  constructor({
    isClone = false,
    cloneCount = 0,
    clonePattern = Constant.CLONE_PATTERNS.square,
    ...args
  }) {
    super({...args})
    this.entityTypes = this.entityTypes.concat('GASEOUS')
    this.isClone = isClone;
    this.cloneCount = cloneCount;
    this.clonePattern = cloneDeep(clonePattern);
  }

  getAction (game) {
    let offset = this.clonePattern.positions.find((pos) => !pos.taken);
    if (!this.isClone && offset) {
      offset.taken = true
      let clone = cloneDeepWith(this, (value, key) => {
        switch (key) {
          case 'id':
          case 'game':
          case 'engine':
          case 'clones':
            return null
            break;
          default:
            return undefined
            break;
        }
      });
      clone.game = game;
      clone.id = uuid();
      if (this.hasOwnProperty('pos')) {
        let referencePos = this.pos
        clone.pos = {
          x: referencePos.x + offset.x,
          y: referencePos.y + offset.y
        }
      }
      if (clone.hasOwnProperty('path')) {
        clone.path = clone.path.map((pos) => {
          return {
            x: pos.x + offset.x,
            y: pos.y + offset.y
          }
        })
      }
      clone.isClone = true
      this.cloneCount += 1
      game.addActor(clone);
    }

    let result = super.getAction(game);
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
    // this.game.engine.currentActor = 0;
    this.game.draw()
  }
}

export const UI_Cursor = pipe(
  Acting, 
  Rendering, 
  Playing, 
  UI
)(Entity);

export const Actor = pipe(
  Acting, 
  Rendering
)(Entity);

export const Chaser = pipe(
  Acting, 
  Rendering, 
  Chasing, 
  Destructable
)(Entity);

export const Player = pipe(
  Acting, 
  Rendering, 
  Destructable, 
  Charging, 
  Signing, 
  Containing, 
  Equiping, 
  Attacking, 
  Playing
)(Entity);

export const Weapon = pipe(
  Rendering, 
  Equipable, 
  Attacking
)(Entity);

export const DestructiveProjectile = pipe(
  Acting, 
  Rendering, 
  Attacking, 
  DestructiveProjecting, 
  Destructable
)(Entity);

export const DestructiveCloudProjectile = pipe(
  Acting, 
  Rendering, 
  Attacking, 
  GaseousDestructiveProjecting, 
  Destructable, 
  Gaseous
)(Entity);

export const DestructiveCloudProjectileV2 = pipe(
  Acting, 
  Destructable,
  Parent, 
)(Entity);
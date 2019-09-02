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

export class EquipItemFromContainer extends Base {
  // entities can only equip items from their container/inventory
  constructor({ item, ...args }) {
    super({ ...args });
    this.item = item;
  }
  perform() {
    let success = false;
    let alternative = null;
    if (this.item.equipmentType) {
      let itemInSlot = this.actor.getItemInSlot(this.item.equipmentType);
      if (itemInSlot) {
        this.actor.addToContainer(itemInSlot);
      }
      this.actor.removeFromContainer(this.item);
      this.actor.equip(this.item.equipmentType, this.item);
      console.log(`${this.actor.name} equips ${this.item.name}.`);
      success = true;
    }

    this.actor.energy -= this.energyCost;
    
    return {
      success,
      alternative,
    }
  }
};

export class EquipItemFromTile extends Base {
  // entities can only equip items from their container/inventory
  constructor({ item, ...args }) {
    super({ ...args });
    this.item = item;
  }

  perform () {
    let success = false;
    let alternative = null;
    if (this.item.equipmentType) {
      let itemInSlot = this.actor.getItemInSlot(this.item.equipmentType);
      if (itemInSlot) {
        this.game.map[Helper.coordsToString(this.actor.pos)].entities.push(itemInSlot);
      }

      let entities = this.game.map[Helper.coordsToString(this.actor.pos)].entities
      this.game.map[Helper.coordsToString(this.actor.pos)].entities = entities.filter((it) => it.id !== this.item.id);
      
      this.actor.equip(this.item);
      console.log(`${this.actor.name} equips ${this.item.name}.`);
      success = true;
    }

    this.actor.energy -= this.energyCost;
    return {
      success,
      alternative,
    }
  }
};

export class UnequipItem extends Base {
  constructor({ item, ...args }) {
    super({ ...args });
    this.item = item;
  }
  perform() {
    console.log(`${this.actor.name} puts ${this.item.name} away.`);
    this.actor.unequip(this.item);
    this.actor.addToContainer(this.item);
    this.actor.energy -= this.energyCost;
    return {
      success: true,
      alternative: null,
    }
  }
};

export class DropItem extends Base {
  constructor({ item, ...args }) {
    super({ ...args });
    this.item = item;
  }
  perform() {
    console.log(`${this.actor.name} drops ${this.item.name}.`);
    this.actor.removeFromContainer(this.item);
    this.game.map[Helper.coordsToString(this.actor.pos)].entities.push(this.item);
    this.actor.energy -= this.energyCost;
    return {
      success: true,
      alternative: null,
    }
  }
};

export class PickupItem extends Base {
  constructor({ item, ...args }) {
    super({ ...args });
    this.item = item;
  }
  perform() {
    console.log(`${this.actor.name} picks up ${this.item.name}.`);
    this.actor.addToContainer(this.item);
    let entities = this.game.map[Helper.coordsToString(this.actor.pos)].entities
    this.game.map[Helper.coordsToString(this.actor.pos)].entities = entities.filter((it) => it.id !== this.item.id);
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

export class Charge extends Base {
  constructor({chargeAmount, ...args}) {
    super({...args});
    this.chargeAmount = chargeAmount;
  }
  perform() {
    console.log(`${this.actor.name} is charging up!`);
    this.actor.energy -= this.energyCost;
    this.actor.increaseCharge(this.chargeAmount);
    return {
      success: true,
      alternative: null,
    }
  }
};

export class Release extends Base {
  constructor({ chargeCost, ...args }) {
    super({ ...args });
    this.chargeCost = chargeCost;
  }
  perform() {
    let success = false;
    if (this.actor.charge >= this.chargeCost) {
      console.log(`${this.actor.name} is releasing ${this.chargeCost} volts!`);
      this.actor.energy -= this.energyCost;
      this.actor.decreaseCharge(this.chargeCost);
      success = true;
    }
    return {
      success,
      alternative: null,
    }
  }
};

export class Sign extends Base {
  constructor({ sign, ...args }) {
    super({ ...args });
    this.sign = sign;
  }
  perform() {
    console.log(`${this.actor.name} threw a ${this.sign.name} sign.`);
    this.actor.addSign(this.sign);
    this.actor.energy -= this.energyCost;
    return {
      success: true,
      alternative: null,
    }
  }
};

export class SignRelease extends Base {
  constructor({requiredSequence = [], ...args}) {
    super({...args});
    this.requiredSequence = requiredSequence;
  }

  requiredSequenceIsFulfilled () {
    let signHistory = this.actor.signHistory.concat();
    let relevantHistory = signHistory.slice(
      Math.max(signHistory.length - this.requiredSequence.length, 0)
    )
    let result = JSON.stringify(relevantHistory) === JSON.stringify(this.requiredSequence);
    return result
  }

  perform() {
    let success = false;
    if (this.requiredSequenceIsFulfilled()) {
      console.log(
        `${this.actor.name} is releasing the power of ${this.requiredSequence.map(
          (sign) => sign.type
        ).join(' and ')}!`
      );
      this.actor.energy -= this.energyCost;
      success = true;
      this.actor.clearSigns();
    }
    return {
      success,
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
      alternative = new Action.Attack({
        targetPos: this.targetPos,
        game: this.game, 
        actor: this.actor, 
        energyCost: Constant.ENERGY_THRESHOLD
      })
      // alternative = new Action.Say({
      //   message: `Ooh I can\'t move there!`, 
      //   game: this.game, 
      //   actor: this.actor, 
      //   energyCost: Constant.ENERGY_THRESHOLD
      // })
    }

    return {
      success,
      alternative,
    }
  }
};

export class Attack extends Base {
  constructor({ targetPos, processDelay = 25, ...args}) {
    super({...args});
    this.targetPos = targetPos
    this.processDelay = processDelay
  }
  perform() {
    let success = false;
    let alternative = null;
    console.log(this.actor);
    
    if (!this.actor.hasOwnProperty('attackDamage')) { 
      return { 
        success: true, 
        alternative: new Action.Say({
          message: `Ooh I don\'t know how to attack`,
          game: this.game,
          actor: this.actor,
        }), 
      } 
    }
    let tile = this.game.map[Helper.coordsToString(this.targetPos)]
    if (!tile) { return { success, alternative} }
    let targets = Helper.getDestructableEntities(tile.entities);
    if (targets.length > 0) {
      let target = targets[0];
      let damage = this.actor.getAttackDamage();
      target.decreaseDurability(damage);
      this.actor.energy -= this.energyCost;
      success = true;
    }

    return {
      success,
      alternative,
    }
  }
};

export class ThrowDestructable extends Move {
  constructor({ ...args }) {
    super({ ...args });
  }

  perform () {
    let success = false;
    let alternative = null;
    this.actor.passable = false;
    let move_result = super.perform();
    if (this.actor.path.length > 0 && move_result.success && !move_result.alternative) {
      this.actor.path.shift();
      success = true;
    } else {
      let entities = Helper.getDestructableEntities(this.game.map[Helper.coordsToString(this.targetPos)].entities);
      if (entities.length > 0) {
        entities[0].decreaseDurability(this.actor.attackDamage);
      }
      success = true;
      alternative = new Action.DestroySelf({
        game: this.game,
        actor: this.actor,
        energyCost: Constant.ENERGY_THRESHOLD,
      });
    }

    return {
      success,
      alternative,
    }
  }
}
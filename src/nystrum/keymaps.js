import * as Constant from './constants';
import * as Action from './actions';
import * as Helper from '../helper';
import * as Entity from './entites';
import * as Item from './items';

/******************** UI ********************/
const moveCursor = (direction, engine) => {
  let actor = engine.actors[engine.currentActor];
  let newX = actor.pos.x + direction[0];
  let newY = actor.pos.y + direction[1];
  actor.setNextAction(new Action.CursorMove({
    targetPos: { x: newX, y: newY },
    game: engine.game,
    actor,
    energyCost: Constant.ENERGY_THRESHOLD
  }))
}

const throwKunai = (engine, actor) => {
  let cursor = engine.actors[engine.currentActor];
  cursor.active = false;
  let throwDirection = {
    x: Math.sign(cursor.pos.x - actor.pos.x),
    y: Math.sign(cursor.pos.y - actor.pos.y),
  }
  engine.game.removeActor(cursor);
  let kunai = actor.contains(Item.TYPE.KUNAI);
  if (kunai) {
    kunai.game = engine.game;
    kunai.pos = { 
      x: actor.pos.x + throwDirection.x,  
      y: actor.pos.y + throwDirection.y,  
    };
    kunai.targetPos = { ...cursor.pos };
    actor.removeFromContainer(kunai);
    engine.actors.push(kunai);
    kunai.createPath(engine.game);
    engine.game.placeActorsOnMap();
    engine.game.draw();
    actor.setNextAction(
      new Action.Say({
        message: `I'll get you with this kunai!`,
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD
      })
    )
  } else {
    console.log('I have no kunais left');
  }
}

const throwKunaiCloud = (engine, actor) => {
  let cursor = engine.actors[engine.currentActor];
  cursor.active = false;
  let throwDirection = {
    x: Math.sign(cursor.pos.x - actor.pos.x),
    y: Math.sign(cursor.pos.y - actor.pos.y),
  }
  engine.game.removeActor(cursor);
  let cloud = Item.kunaiCloud({
    engine, 
    actor, 
    targetPos: {...cursor.pos},
    throwDirection,
  });
  if (cloud) {
    cloud.pos = { 
      x: actor.pos.x + throwDirection.x,  
      y: actor.pos.y + throwDirection.y,  
    };
    engine.actors.push(cloud);
    actor.setNextAction(
      new Action.Say({
        message: `I'll get you with these kunai!`,
        game: engine.game,
        actor,
        energyCost: Constant.ENERGY_THRESHOLD
      })
    )
  } else {
    console.log('I have no kunais left');
  }
}

export const cursorToThrowItem = (engine, initiatedBy) => {
  return {
    w: () => moveCursor(Constant.DIRECTIONS.N, engine),
    d: () => moveCursor(Constant.DIRECTIONS.E, engine),
    s: () => moveCursor(Constant.DIRECTIONS.S, engine),
    a: () => moveCursor(Constant.DIRECTIONS.W, engine),
    t: () => throwKunaiCloud(engine, initiatedBy),
    // t: () => throwKunai(engine, initiatedBy),
  };
}

/******************** PLAYER ********************/

const walk = (direction, engine) => {
  let actor = engine.actors[engine.currentActor];
  let newX = actor.pos.x + direction[0];
  let newY = actor.pos.y + direction[1];
  actor.setNextAction(new Action.Move({
    targetPos: { x: newX, y: newY },
    game: engine.game,
    actor,
    energyCost: Constant.ENERGY_THRESHOLD
  }))
}

const sign = (sign, engine) => {
  let actor = engine.actors[engine.currentActor];
  actor.setNextAction(new Action.Sign({
    sign,
    game: engine.game,
    actor,
    energyCost: Constant.ENERGY_THRESHOLD
  }))
}

const signRelease = (engine) => {
  let actor = engine.actors[engine.currentActor];
  actor.setNextAction(new Action.SignRelease({
    requiredSequence: [
      Constant.HAND_SIGNS.Power,
      Constant.HAND_SIGNS.Healing,
    ],
    game: engine.game,
    actor,
    energyCost: Constant.ENERGY_THRESHOLD
  }))
}

const charge = (engine, chargeAmount) => {
  let actor = engine.actors[engine.currentActor];
  actor.setNextAction(new Action.Charge({
    chargeAmount,
    game: engine.game,
    actor,
    energyCost: Constant.ENERGY_THRESHOLD
  }))
}

const release = (engine, chargeCost) => {
  let actor = engine.actors[engine.currentActor];
  actor.setNextAction(new Action.Release({
    chargeCost,
    game: engine.game,
    actor,
    energyCost: Constant.ENERGY_THRESHOLD
  }))
}

const dropRandom = (engine) => {
  let actor = engine.actors[engine.currentActor];
  if (actor.container.length > 0) {
    actor.setNextAction(new Action.DropItem({
      item: Helper.getRandomInArray(actor.container),
      game: engine.game,
      actor,
      energyCost: Constant.ENERGY_THRESHOLD
    }))
  } else {
    console.log('nothing to drop.');
  }
}

const pickupRandom = (engine) => {
  let actor = engine.actors[engine.currentActor];
  let entities = engine.game.map[Helper.coordsToString(actor.pos)].entities.filter((e) => e.id !== actor.id);
  if (entities.length > 0) {
    actor.setNextAction(new Action.PickupItem({
      item: Helper.getRandomInArray(entities),
      game: engine.game,
      actor,
      energyCost: Constant.ENERGY_THRESHOLD
    }))
  } else {
    console.log('nothing to pickup.');
  }
}

const die = (engine) => {
  let actor = engine.actors[engine.currentActor];
  actor.destroy();
}

const cloneSelf = (engine) => {
  let actor = engine.actors[engine.currentActor];
  actor.setNextAction(new Action.CloneSelf({
    game: engine.game,
    actor,
  }))
}

const equip = (engine) => {
  let actor = engine.actors[engine.currentActor];
  let item = actor.container.find((item) => item.equipmentType === Constant.EQUIPMENT_TYPES.HAND);
  if (item) {
    actor.setNextAction(new Action.EquipItemFromContainer({
      item,
      game: engine.game,
      actor,
    }))
  } else {
    console.log('nothing to equip.');
  }
}

const unequip = (engine) => {
  let actor = engine.actors[engine.currentActor];
  let slot = actor.equipment.find((slot) => slot.item !== null);
  if (slot) {
    actor.setNextAction(new Action.UnequipItem({
      item: slot.item,
      game: engine.game,
      actor,
    }))
  } else {
    console.log('nothing to unequip.');
  }
}

const activateThrowCursor = (engine) => {
  let game = engine.game;
  let currentActor = game.engine.actors[game.engine.currentActor]
  let pos = currentActor.pos;

  let cursor = new Entity.UI_Cursor({
    initiatedBy: currentActor,
    pos,
    renderer: {
      character: '█',
      color: 'white',
      background: '',
    },
    name: 'Cursor',
    game,
    keyMap: cursorToThrowItem(engine, currentActor),
  })
  game.addActor(cursor);
  game.engine.currentActor = game.engine.actors.length - 1
}

const addActor = (game) => {
  let targetEntity = game.engine.actors[game.engine.currentActor]
  let pos = Helper.getRandomPos(game.map).coordinates

  let actor = new Entity.Chaser({
    targetEntity,
    pos,
    renderer: {
      character: Helper.getRandomInArray(['◉', '⛨']),
      color: 'white',
      background: '',
    },
    name: 'Ross',
    game,
    actions: [],
    durability: Helper.getRandomInArray([1, 2, 4, 8]),
    speed: 60,
  })
  game.addActor(actor);
}

export const player = (engine) => {
  return {
    w: () => walk(Constant.DIRECTIONS.N, engine),
    d: () => walk(Constant.DIRECTIONS.E, engine),
    s: () => walk(Constant.DIRECTIONS.S, engine),
    a: () => walk(Constant.DIRECTIONS.W, engine),
    e: () => equip(engine),
    q: () => unequip(engine),
    k: () => cloneSelf(engine),
    // k: () => die(engine),
    i: () => dropRandom(engine),
    p: () => pickupRandom(engine),
    t: () => activateThrowCursor(engine),
    y: () => addActor(engine.game),
    c: () => charge(engine, 1),
    // r: () => release(engine, 5),
    '1': () => sign(Constant.HAND_SIGNS.Power, engine),
    '2': () => sign(Constant.HAND_SIGNS.Healing, engine),
    '3': () => sign(Constant.HAND_SIGNS.Absolute, engine),
    r: () => signRelease(engine),
  };
}

import * as Constant from './constants';
import * as Action from './actions';
import * as Helper from '../helper';
import * as Entity from './entites';
import * as Item from './items';

/******************** Helper ********************/
const addAlphabeticallyToKeymap = (keymap, obj) => {
  let alphabetAllowed = Constant.ALPHABET.filter((letter) => {
    return !Object.keys(keymap).includes(letter);
  });
  keymap[alphabetAllowed[0]] = obj;
}

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
  let cloud = Item.fireballCloud({
  // let cloud = Item.kunaiCloud({
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
    w: {
      activate: () => moveCursor(Constant.DIRECTIONS.N, engine),
      label: 'move',
    },
    d: {
      activate: () => moveCursor(Constant.DIRECTIONS.E, engine),
      label: 'move',
    },
    s: {
      activate: () => moveCursor(Constant.DIRECTIONS.S, engine),
      label: 'move',
    },
    a: {
      activate: () => moveCursor(Constant.DIRECTIONS.W, engine),
      label: 'move',
    },
    t: {
      activate: () => throwKunaiCloud(engine, initiatedBy),
      label: 'Throw Cloud',
    },
    y: {
      activate: () => throwKunai(engine, initiatedBy),
      label: 'Throw Kunai',
    },
  };
}

const closeInventory = (engine) => {
  let currentUiActor = engine.actors[engine.currentActor];
  engine.game.removeActor(currentUiActor);
  engine.currentActor = engine.actors.length - 1;
  engine.game.visibleInventory = null;
}

export const keymapEquipFromInventory = (engine, initiatedBy) => {
  let keymap = {
    e: {
      activate: () => closeInventory(engine),
      label: 'Close',
    }
  };

  initiatedBy.container.map((item, index) => {
    let obj = {
      activate: null,
      label: ''
    }
    obj['activate'] = () => {
      console.log(`setting action for ${initiatedBy.name} to equip ${item.name}`);
      initiatedBy.setNextAction(new Action.EquipItemFromContainer({
        item,
        game: engine.game,
        actor: initiatedBy,
      }))
      closeInventory(engine);
    }
    obj['label'] = `Equip ${item.name}`;
    addAlphabeticallyToKeymap(keymap, obj);
    return true;
  })

  return keymap;
}

export const keymapDropFromInventory = (engine, initiatedBy) => {
  let keymap = {
    e: {
      activate: () => closeInventory(engine),
      label: 'Close',
    }
  };

  initiatedBy.container.map((item, index) => {
    let obj = {
      activate: null,
      label: ''
    }
    obj['activate'] = () => {
      console.log(`setting action for ${initiatedBy.name} to drop ${item.name}`);
      initiatedBy.setNextAction(new Action.DropItem({
        item,
        game: engine.game,
        actor: initiatedBy,
        energyCost: Constant.ENERGY_THRESHOLD
      }));
      closeInventory(engine);
    }
    obj['label'] = `Drop ${item.name}`;
    addAlphabeticallyToKeymap(keymap, obj);
    return true;
  })

  return keymap;
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

const activateThrowCursor = (engine) => {
  let game = engine.game;
  let currentActor = game.engine.actors[game.engine.currentActor]
  let pos = currentActor.pos;

  let cursor = new Entity.UI_Actor({
    initiatedBy: currentActor,
    pos,
    renderer: {
      character: '█',
      color: 'white',
      background: '',
    },
    name: 'Cursor',
    game,
    keymap: cursorToThrowItem(engine, currentActor),
  })
  game.addActor(cursor);
  game.engine.currentActor = game.engine.actors.length - 1
}

const activateInventory = (engine) => {
  let currentActor = engine.actors[engine.currentActor]
  engine.game.visibleInventory = currentActor.container; 

  let ui = new Entity.UI_Actor({
    initiatedBy: currentActor,
    pos: {...currentActor.pos},
    renderer: {
      character: 'I',
      color: 'white',
      background: '',
    },
    name: 'Inventory',
    game: engine.game,
    // keymap: keymapEquipFromInventory(engine, currentActor),
  })
  engine.game.addActor(ui);
  engine.currentActor = engine.actors.length - 1
  ui.keymap = keymapEquipFromInventory(engine, currentActor);
}

const activateDrop = (engine) => {
  let currentActor = engine.actors[engine.currentActor]
  engine.game.visibleInventory = currentActor.container; 

  let ui = new Entity.UI_Actor({
    initiatedBy: currentActor,
    pos: {...currentActor.pos},
    renderer: {
      character: 'D',
      color: 'white',
      background: '',
    },
    name: 'Drop',
    game: engine.game,
  })
  engine.game.addActor(ui);
  engine.currentActor = engine.actors.length - 1
  ui.keymap = keymapDropFromInventory(engine, currentActor);
}

const toggleInventory = (engine) => {
  let currentActor = engine.actors[engine.currentActor]
  // engine.game.showUI = !engine.game.showUI; 
  if (!engine.game.visibleInventory) {
    engine.game.visibleInventory = currentActor.container; 
  } else {
    engine.game.visibleInventory = null;
  }
}

export const player = (engine) => {
  return {
    w: {
      activate: () => walk(Constant.DIRECTIONS.N, engine),
      label: 'walk',
    },
    d: {
      activate: () => walk(Constant.DIRECTIONS.E, engine),
      label: 'walk',
    },
    s: {
      activate: () => walk(Constant.DIRECTIONS.S, engine),
      label: 'walk',
    },
    a: {
      activate: () => walk(Constant.DIRECTIONS.W, engine),
      label: 'walk',
    },
    e: {
      activate: () => activateInventory(engine),
      label: 'Open Inventory',
    },
    q: {
      activate: () => unequip(engine),
      label: 'Unequip',
    },
    k: {
      activate: () => cloneSelf(engine),
      label: 'Clone Self',
    },
    g: {
      activate: () => activateDrop(engine),
      label: 'Drop Item',
    },
    p: {
      activate: () => pickupRandom(engine),
      label: 'Pickup',
    },
    t: {
      activate: () => activateThrowCursor(engine),
      label: 'Throw',
    },
    y: {
      activate: () => addActor(engine.game),
      label: 'Add NPC',
    },
    c: {
      activate: () => charge(engine, 1),
      label: 'Charge',
    },
    '1': {
      activate: () => sign(Constant.HAND_SIGNS.Power, engine),
      label: 'Sign - Power',
    },
    '2': {
      activate: () => sign(Constant.HAND_SIGNS.Healing, engine),
      label: 'Sign - Healing',
    },
    '3': {
      activate: () => sign(Constant.HAND_SIGNS.Absolute, engine),
      label: 'Sign - Absolution',
    },
    r: {
      activate: () => signRelease(engine),
      label: 'Release',
    },
  };
}
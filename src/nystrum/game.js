import React from 'react';
import * as ROT from 'rot-js';
import * as Constant from './constants';
import * as Action from './actions';
import * as Helper from '../helper';
import * as Entity from './entites';
import * as Item from './items';

export class Game {
  constructor({
    engine = null,
    map = {},
    display = new ROT.Display({ 
      // forceSquareRatio: true, 
      fontSize: 24, 
      bg: '#363636' 
    }),
    tileKey = Constant.TILE_KEY,
  }) {
    this.engine = engine;
    this.map = map;
    this.display = display;
    this.tileKey = tileKey;
    this.cursorIsActive = false;
  }

  randomlyPlaceActorsOnMap() {
    this.engine.actors.forEach((actor) => {
      let pos = Helper.getRandomPos(this.map).coordinates
      let tile = this.map[Helper.coordsToString(pos)]
      actor.pos = {...pos}
      tile.entities.push(actor);
    })
  }

  placeActorsOnMap() {
    this.engine.actors.forEach((actor) => {
      let tile = this.map[Helper.coordsToString(actor.pos)]
      tile.entities.push(actor);
    })
  }

  removeActorFromMap (actor) {
    let tile = this.map[Helper.coordsToString(actor.pos)]
    this.map[Helper.coordsToString(actor.pos)].entities = tile.entities.filter((ac) => ac.id !== actor.id);
  }

  createLevel () {
    let digger = new ROT.Map.Arena();
    let freeCells = [];
    let digCallback = function (x, y, value) {
      if (value) { return; }
      let key = x + "," + y;
      this.map[key] = {
        type: 'GROUND',
        entities: [],
      };
      freeCells.push(key);
    }
    digger.create(digCallback.bind(this));
    this.map[`10,10`] = {
      type: 'WIN',
      entities:[],
    }
    this.randomlyPlaceActorsOnMap()
  }

  canOccupyPosition (pos) {
    let result = false;
    let targetTile = this.map[Helper.coordsToString(pos)];
    if (targetTile) {
      let isOccupied = targetTile.entities.length > 0;
      let hasImpassableEntity = targetTile.entities.filter((entity) => !entity.passable).length > 0;
      if (!hasImpassableEntity) {
        let tile = this.map[Helper.coordsToString(pos)];
        if (this.tileKey[tile.type].passable) {
          result = true;
        }
      }
    }

    return result;
  }

  cursorCanOccupyPosition(pos) {
    let result = false;
    let targetTile = this.map[Helper.coordsToString(pos)];
    if (targetTile) {
      result = true;
    }

    return result;
  }

  show () {
    let d = document.getElementById('display')
    d.appendChild(this.display.getContainer())
  }

  draw () {
    for (let key in this.map) {
      let parts = key.split(",");
      let x = parseInt(parts[0]);
      let y = parseInt(parts[1]);
      let tile = this.map[key];
      let { character, foreground, background } = this.tileKey[tile.type]

      // Proto code to handle tile animations
      // let tileRenderer = this.tileKey[tile.type]
      // if (tileRenderer.animation) {
      //   let frame = Helper.getRandomInArray(tileRenderer.animation);
      //   character = frame.character;
      //   foreground = frame.foreground;
      //   background = frame.background;
      // }

      if (tile.entities.length > 0) {
        let entity = tile.entities[tile.entities.length - 1]
        character = entity.renderer.character
        foreground = entity.renderer.color
        if (entity.renderer.background) {
          background = entity.renderer.background
        }
      }
      this.display.draw(x, y, character, foreground, background);
    }
  }

  addActor (actor) {
    this.engine.actors.push(actor);
    this.placeActorsOnMap(); // replace with placeActorOnMap
    this.draw();
  }

  removeActor (actor) {
    this.engine.actors = this.engine.actors.filter((ac) => ac.id !== actor.id);
    this.engine.currentActor = (this.engine.currentActor) % this.engine.actors.length;
    this.removeActorFromMap(actor);
    this.draw();
  }

  initialize (presserRef) {
    this.engine.game = this;
    this.engine.actors.forEach((actor) => {
      actor.game = this;
    });
    this.show();
    this.createLevel();
    this.draw();
    presserRef.current.focus();
  }
}

/************************** UI ********************************/
const moveCursor = (direction, engine) => {
  let actor = engine.actors[engine.currentActor];
  let newX = actor.pos.x + direction[0];
  let newY = actor.pos.y + direction[1];
  actor.setNextAction(new Action.UIMove({
    targetPos: { x: newX, y: newY },
    game: engine.game,
    actor,
    energyCost: Constant.ENERGY_THRESHOLD
  }))
}

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

const throwKunai = (engine, actor) => {
  let cursor = engine.actors[engine.currentActor];
  cursor.active = false;
  engine.game.cursorIsActive = false;
  engine.game.removeActor(cursor);
  let kunai = actor.contains(Item.TYPE.KUNAI);
  if (kunai) {
    kunai.game = engine.game;
    kunai.pos = {...actor.pos};
    kunai.targetPos = {...cursor.pos};
    actor.removeFromContainer(kunai);
    engine.actors.push(kunai);
    // engine.game.removeActor(cursor);
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

const activateTargetCursor = (engine) => {
  let game = engine.game;
  game.cursorIsActive = true;
  let currentActor = game.engine.actors[game.engine.currentActor]
  let pos = currentActor.pos;

  let cursor = new Entity.UISelector({
    initiatedBy: currentActor,
    pos,
    renderer: {
      character: '█',
      color: 'white',
      background: '',
    },
    name: 'Cursor',
    game,
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

export const handleKeyPress = (event, engine) => {
  if (!engine.isRunning) {
    let keyMap = {};
    if (engine.game.cursorIsActive) {
      let cursor = engine.actors[engine.currentActor];
      keyMap = {
        w: () => moveCursor(Constant.DIRECTIONS.N, engine),
        d: () => moveCursor(Constant.DIRECTIONS.E, engine),
        s: () => moveCursor(Constant.DIRECTIONS.S, engine),
        a: () => moveCursor(Constant.DIRECTIONS.W, engine),
        t: () => throwKunai(engine, cursor.initiatedBy),
      };
    } else {
      keyMap = {
        w: () => walk(Constant.DIRECTIONS.N, engine),
        d: () => walk(Constant.DIRECTIONS.E, engine),
        s: () => walk(Constant.DIRECTIONS.S, engine),
        a: () => walk(Constant.DIRECTIONS.W, engine),
        e: () => equip(engine),
        q: () => unequip(engine),
        k: () => die(engine),
        i: () => dropRandom(engine),
        p: () => pickupRandom(engine),
        t: () => activateTargetCursor(engine),
        y: () => addActor(engine.game),
        c: () => charge(engine, 1),
        // r: () => release(engine, 5),
        '1': () => sign(Constant.HAND_SIGNS.Power, engine),
        '2': () => sign(Constant.HAND_SIGNS.Healing, engine),
        '3': () => sign(Constant.HAND_SIGNS.Absolute, engine),
        r: () => signRelease(engine),
      };
    } 

    let code = event.key;
    if (!(code in keyMap)) { return; }
    keyMap[code]();

    let actor = engine.actors[engine.currentActor];
    let tile = engine.game.map[Helper.coordsToString(actor.pos)]
    if (tile.type === 'WIN') {
      alert('You won!!!! HOly craaaaap! You did it man, you really did it!')
    } else {
      engine.start()
    }

  }
  return;
}

export const DisplayElement = (presserRef, handleKeyPress, engine) => {
  return (
    <div
      id='display'
      ref={presserRef}
      onKeyDown={(event) => handleKeyPress(event, engine)}
      tabIndex='0'
    />
  )
}
/************************** UI ********************************/

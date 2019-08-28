import React from 'react';
import * as ROT from 'rot-js';
import * as Constant from './constants';
import * as Action from './actions';
import * as Helper from '../helper';
import * as Entity from './entites';

export class Game {
  constructor({
    engine = null,
    map = {},
    display = new ROT.Display({ fontSize: 24, bg: 'black' }),
    tileKey = Constant.TILE_KEY,
  }) {
    this.engine = engine;
    this.map = map;
    this.display = display;
    this.tileKey = tileKey;
  }

  placeActorsOnMap() {
    this.engine.actors.forEach((actor) => {
      let tile = this.map[Helper.coordsToString(actor.pos)]
      tile.entities.push(actor);
    })
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
    this.map[`10,11`] = {
      type: 'WIN',
      entities:[],
    }
    this.placeActorsOnMap()
  }

  canOccupyPosition (pos) {
    let result = false;
    let targetTile = this.map[Helper.coordsToString(pos)];
    if (targetTile) {
      let isOccupied = targetTile.entities.length > 0;
      if (!isOccupied) {
        let tile = this.map[Helper.coordsToString(pos)];
        if (this.tileKey[tile.type].passable) {
          result = true;
        }
      }
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

const die = (engine) => {
  let actor = engine.actors[engine.currentActor];
  actor.destroy();
}

const throwKunai = (engine, targetPos) => {
  let actor = engine.actors[engine.currentActor];
  let kunai = new Entity.Projectile({
    game: engine.game,
    targetPos,
    pos: { x: actor.pos.x, y: actor.pos.y},
    renderer: {
      character: '>',
      color: 'white',
      background: '',
    },
    name: 'Kunai',
    actions: [],
    speed: 500,
  })
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
}

export const handleKeyPress = (event, engine) => {
  if (!engine.isRunning) {
    let keyMap = {
      w: () => walk(Constant.DIRECTIONS.N, engine),
      d: () => walk(Constant.DIRECTIONS.E, engine),
      s: () => walk(Constant.DIRECTIONS.S, engine),
      a: () => walk(Constant.DIRECTIONS.W, engine),
      k: () => die(engine),
      t: () => throwKunai(engine, engine.actors[2].pos),
    };

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

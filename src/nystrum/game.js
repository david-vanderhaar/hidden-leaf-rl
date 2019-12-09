import React from 'react';
import * as ROT from 'rot-js';
import * as Constant from './constants';
import * as Helper from '../helper';

export class Game {
  constructor({
    engine = null,
    map = {},
    display = new ROT.Display({ 
      // forceSquareRatio: true,
      width: 90,
      // height: 100,
      fontSize: 24, 
      bg: '#424242' 
    }),
    tileKey = Constant.TILE_KEY,
  }) {
    this.engine = engine;
    this.map = map;
    this.display = display;
    this.tileKey = tileKey;
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
      if (tile) {
        tile.entities.push(actor);
      } else {
        console.log(`could not place ${actor.id}: ${actor.name} on map`);
      }
    })
  }

  placeActorOnMap(actor) {
    let tile = this.map[Helper.coordsToString(actor.pos)]
    if (tile) {
      tile.entities.push(actor);
      return true
    } else {
      console.log(`could not place ${actor.id}: ${actor.name} on map`);
      return false
    }
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
      let type = 'GROUND';
      let currentFrame = 0;

      if (Constant.TILE_KEY[type].animation) {
        currentFrame = Helper.getRandomInt(0, Constant.TILE_KEY[type].animation.length)
      }

      this.map[key] = {
        type,
        currentFrame,
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
      //   let frame = tileRenderer.animation[tile.currentFrame];
        
      //   character = frame.character;
      //   foreground = frame.foreground;
      //   background = frame.background;
      //   tile.currentFrame = (tile.currentFrame + 1) % tileRenderer.animation.length;
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

  addActor (actor, engine = this.engine) {
    let isPlaced = this.placeActorOnMap(actor); // replace with placeActorOnMap
    if (!isPlaced) { return false }
    engine.actors.push(actor);
    this.draw();
    return true
  }

  placeAndDrawActor (actor) {
    this.placeActorsOnMap(); // replace with placeActorOnMap
    this.draw();
  }

  removeActor (actor) {
    this.engine.actors = this.engine.actors.filter((ac) => ac.id !== actor.id);
    console.log(this.engine.currentActor);
    console.log(this.engine.actors.length);
    this.engine.currentActor = this.engine.actors.length - 1; // should remove need for this line
    // this.engine.currentActor = (this.engine.currentActor) % this.engine.actors.length;
    // this.engine.currentActor = (this.engine.currentActor + 1) % this.engine.actors.length;
    this.removeActorFromMap(actor);
    console.log('remove actor');
    console.log(actor);
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
export const handleKeyPress = (event, engine) => {
  if (!engine.isRunning) {
    let actor = engine.actors[engine.currentActor];
    let keymap = actor.keymap;
    let code = event.key;
    if (!(code in keymap)) { return; }
    keymap[code]['activate']();
    engine.start()
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

import React from 'react';
import * as ROT from 'rot-js';
import * as Constants from './constants';

export class Game {
  constructor(
    engine = null,
    map = {},
    display = new ROT.Display({ fontSize: 24, bg: '#099' }),
    tileKey = Constants.TILE_KEY,
  ) {
    this.engine = engine;
    this.map = map;
    this.display = display;
    this.tileKey = tileKey;
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
    this.show();
    this.createLevel();
    this.draw();
    presserRef.current.focus();
  }

  // canOccupy (map, pos) {
  //   if (map.hasOwnProperty(Helper.coordsToString(pos))) {
  //     let tile = map[Helper.coordsToString(pos)];
  //     if (Helper.TILE_KEY()[tile.type].passable && Helper.getImpassableEntities(tile.entities).length === 0) {
  //       return true
  //     }
  //   } else {
  //     return false
  //   }
  // }
}

/************************** UI ********************************/
// handleKeyPress = (event) => {
//   let keyMap = {
//     w: 0,
//     d: 1,
//     s: 2,
//     a: 3,
//   };

//   let code = event.key;
//   let dir = ROT.DIRS[4][keyMap[code]];
//   if (code === 't') {
//     kunai.sendEvent(kunai, 'MOVE', {
//       currentPos: kunai.components.body.pos,
//       targetPos: {
//         x: entity.components.body.pos.x + 1,
//         y: entity.components.body.pos.y,
//       },
//     })
//     return kunai.sendEvent(kunai, 'THROW', { direction: { x: 1, y: 0 } })
//   }
//   if (!(code in keyMap)) { return; }
//   let newX = entity.components.body.pos.x + dir[0];
//   let newY = entity.components.body.pos.y + dir[1];

//   entity.sendEvent(
//     entity, 'MOVE', {
//       currentPos: entity.components.body.pos,
//       targetPos: {
//         x: newX,
//         y: newY
//       }
//     }
//   )

//   return;
// }

export const DisplayElement = (presserRef) => {
  return (
    <div
      id='display'
      ref={presserRef}
      onKeyDown={(event) => this.handleKeyPress(event)}
      tabIndex='0'
    />
  )
}
/************************** UI ********************************/

// SHOW(game.display.getContainer());
// CREATE_LEVEL(game);
// Helper.DRAW(game.map, game.display)
// this.presserRef.current.focus();

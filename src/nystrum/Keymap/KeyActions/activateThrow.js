import * as Action from '../../actions';
import * as Item from '../../items';
import * as Constant from '../../constants';
import { UI_Actor } from '../../entites';
import { moveCursor } from './moveCursor';

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
    engine.addActorAsPrevious(kunai);
    engine.setActorToPrevious(kunai);
    // engine.actors.push(kunai);
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
    targetPos: { ...cursor.pos },
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

const keymapCursorToThrowItem = (engine, initiatedBy) => {
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
    // t: {
    //   activate: () => throwKunaiCloud(engine, initiatedBy),
    //   label: 'Throw Cloud',
    // },
    // y: {
    t: {
      activate: () => throwKunai(engine, initiatedBy),
      label: 'Throw Kunai',
    },
  };
}

export const activateThrow = (engine) => {
  let game = engine.game;
  let currentActor = engine.actors[game.engine.currentActor]
  let pos = currentActor.pos;

  let cursor = new UI_Actor({
    initiatedBy: currentActor,
    pos,
    renderer: {
      character: '█',
      color: 'white',
      background: '',
    },
    name: 'Cursor',
    game,
    keymap: keymapCursorToThrowItem(engine, currentActor),
  })
  engine.addActorAsPrevious(cursor);
  engine.setActorToPrevious(cursor);
  engine.game.placeActorOnMap(cursor)
  engine.game.draw()
}
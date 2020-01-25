import * as Action from '../../actions';
import * as Constant from '../../constants';
import { UI_Actor } from '../../entites';

const throwDirectionalKunai = (direction, engine, actor) => {
  let cursor = engine.actors[engine.currentActor];
  cursor.active = false;
  let throwDirection = {
    x: Math.sign(cursor.pos.x - actor.pos.x),
    y: Math.sign(cursor.pos.y - actor.pos.y),
  }
  engine.game.removeActor(cursor);
  let kunai = actor.contains('directionalKunai');
  if (kunai) {
    kunai.game = engine.game;
    kunai.pos = {
      x: actor.pos.x + throwDirection.x,
      y: actor.pos.y + throwDirection.y,
    };
    kunai.direction = direction;
    actor.removeFromContainer(kunai);
    engine.addActorAsPrevious(kunai);
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

const keymapCursorToThrowItem = (engine, initiatedBy) => {
  return {
    w: {
      activate: () => throwDirectionalKunai(Constant.DIRECTIONS.N, engine, initiatedBy),
      label: 'throw N',
    },
    e: {
      activate: () => throwDirectionalKunai(Constant.DIRECTIONS.NE, engine, initiatedBy),
      label: 'throw NE',
    },
    d: {
      activate: () => throwDirectionalKunai(Constant.DIRECTIONS.E, engine, initiatedBy),
      label: 'throw E',
    },
    c: {
      activate: () => throwDirectionalKunai(Constant.DIRECTIONS.SE, engine, initiatedBy),
      label: 'throw SE',
    },
    x: {
      activate: () => throwDirectionalKunai(Constant.DIRECTIONS.S, engine, initiatedBy),
      label: 'throw S',
    },
    z: {
      activate: () => throwDirectionalKunai(Constant.DIRECTIONS.SW, engine, initiatedBy),
      label: 'throw SW',
    },
    a: {
      activate: () => throwDirectionalKunai(Constant.DIRECTIONS.W, engine, initiatedBy),
      label: 'throw W',
    },
    q: {
      activate: () => throwDirectionalKunai(Constant.DIRECTIONS.NW, engine, initiatedBy),
      label: 'throw NW',
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
  engine.game.placeActorOnMap(cursor)
  engine.game.draw()
}
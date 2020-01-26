import * as Action from '../../actions';
import * as Constant from '../../constants';
import * as Item from '../../items';
import { UI_Actor } from '../../entites';
import { createEightDirectionMoveOptions } from '../helper';

const throwDirectionalKunai = (direction, engine, actor) => {
  let cursor = engine.actors[engine.currentActor];
  cursor.active = false;
  let throwDirection = {
    x: Math.sign(cursor.pos.x - actor.pos.x),
    y: Math.sign(cursor.pos.y - actor.pos.y),
  }
  engine.game.removeActor(cursor);
  let kunai = actor.contains(Item.TYPE.DIRECTIONAL_KUNAI);
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
    ...createEightDirectionMoveOptions(
      (direction, engine) => throwDirectionalKunai(direction, engine, initiatedBy),
      engine,
      'throw',
    )
  }
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
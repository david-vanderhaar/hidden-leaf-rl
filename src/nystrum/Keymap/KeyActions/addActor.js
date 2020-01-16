import * as Helper from '../../../helper';
import { Bandit } from '../../entites';

export const addActor = (game) => {
  let targetEntity = game.engine.actors[game.engine.currentActor]
  let pos = Helper.getRandomPos(game.map).coordinates

  let actor = new Bandit({
    targetEntity,
    pos,
    renderer: {
      character: Helper.getRandomInArray(['◉']),
      color: 'white',
      background: '',
    },
    name: 'Ross',
    game,
    actions: [],
    durability: Helper.getRandomInArray([1]),
    // durability: Helper.getRandomInArray([1, 2, 4, 8]),
    speed: 100,
  })
  // game.placeActorOnMap(actor)
  if (game.randomlyPlaceActorOnMap(actor)) {
    game.engine.addActor(actor);
    game.draw();
  };
}
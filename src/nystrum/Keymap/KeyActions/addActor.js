import * as Helper from '../../../helper';
import { Bandit } from '../../entites';

const getBanditStats = () => {
  let banditLevels = [
    {
      name: 'Ross',
      renderer: {
        character: Helper.getRandomInArray(['◉']),
        color: '#ced5dd',
        background: '',
      },
      durability: 1,
      attackDamage: 1,
      speed: 100,
    },
    {
      name: 'Kevin',
      renderer: {
        character: Helper.getRandomInArray(['◉']),
        color: '#3fc072',
        background: '',
      },
      durability: 2,
      attackDamage: 1,
      speed: 100,
    },
    {
      name: 'Jacob',
      renderer: {
        character: Helper.getRandomInArray(['◉']),
        color: '#67a1d7',
        background: '',
      },
      durability: 3,
      attackDamage: 1,
      speed: 100,
    },
    {
      name: 'Jarod',
      renderer: {
        character: Helper.getRandomInArray(['◉']),
        color: '#e16264',
        background: '',
      },
      durability: 1,
      attackDamage: 5,
      speed: 300,
    },
    {
      name: 'Bigii',
      renderer: {
        character: Helper.getRandomInArray(['◉']),
        color: '#9f62e1',
        background: '',
      },
      durability: 15,
      attackDamage: 10,
      speed: 100,
    },
  ]
  return Helper.getRandomInArray(banditLevels);

}

export const addActor = (game) => {
  let targetEntity = game.engine.actors[game.engine.currentActor]
  let pos = Helper.getRandomPos(game.map).coordinates
  const banditStats = getBanditStats();
  let actor = new Bandit({
    targetEntity,
    pos,
    renderer: banditStats.renderer,
    name: banditStats.name,
    game,
    actions: [],
    attackDamage: banditStats.attackDamage,
    durability: banditStats.durability,
    speed: banditStats.speed,
  })
  // game.placeActorOnMap(actor)
  if (game.randomlyPlaceActorOnMap(actor)) {
    game.engine.addActor(actor);
    game.draw();
  };
}
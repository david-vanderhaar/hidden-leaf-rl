import * as Entity from './entites';

export const TYPE = {
  KUNAI: 'Kunai',
}

export const kunai = (engine, actor, targetPos) => new Entity.DestructiveProjectile({
  game: engine.game,
  targetPos,
  passable: true,
  pos: actor ? { x: actor.pos.x, y: actor.pos.y } : null,
  renderer: {
    character: '>',
    color: 'white',
    background: '',
  },
  name: TYPE.KUNAI,
  actions: [],
  speed: 500,
})
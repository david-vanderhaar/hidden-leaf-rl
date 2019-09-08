import * as Entity from './entites';
import * as Constant from './constants';
import * as Helper from '../helper';

export const TYPE = {
  KUNAI: 'Kunai',
  SWORD: 'Sword',
}

export const kunai = (engine, actor, targetPos) => new Entity.DestructiveProjectile({
  game: engine.game,
  targetPos,
  passable: true,
  pos: actor ? { x: actor.pos.x, y: actor.pos.y } : null,
  renderer: {
    // character: '>',
    character: '🗡️',
    color: 'white',
    background: '',
  },
  name: TYPE.KUNAI,
  speed: 500,
  range: 10,
})

export const fireball = (engine, actor, targetPos) => new Entity.DestructiveCloudProjectile({
  game: engine.game,
  targetPos,
  passable: true,
  pos: actor ? { x: actor.pos.x, y: actor.pos.y } : null,
  renderer: {
    // character: '@',
    character: '🔥',
    color: 'wheat',
    background: 'tomato',
  },
  name: TYPE.KUNAI,
  speed: 100,
  range: 10,
  cloneLimit: 7,
  clonePattern: Constant.CLONE_PATTERNS.square,
})

export const sword = (engine) => new Entity.Weapon({
  game: engine.game,
  name: TYPE.SWORD,
  passable: true,
  attackDamage: 1,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    // character: '|',
    character: '🗡️',
    color: 'white',
    background: '',
  },
})
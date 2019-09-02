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
    character: '>',
    color: 'white',
    background: '',
  },
  name: TYPE.KUNAI,
  speed: 500,
})

export const sword = (engine) => new Entity.Weapon({
  game: engine.game,
  name: TYPE.SWORD,
  passable: true,
  attackDamage: 1,
  equipmentType: Constant.EQUIPMENT_TYPES.HAND,
  renderer: {
    character: '|',
    color: 'white',
    background: '',
  },
})
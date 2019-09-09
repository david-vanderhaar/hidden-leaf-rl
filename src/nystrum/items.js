import * as Entity from './entites';
import * as Constant from './constants';
import * as Helper from '../helper';

export const TYPE = {
  KUNAI: 'Kunai',
  SWORD: 'Sword',
}

export const kunaiCloud = (engine, actor, targetPos) => new Entity.DestructiveCloudProjectileV2({
  game: engine.game,
  passable: true,
  speed: 500,
  children: [...Array(3).fill('').map(() => {
    let pos = {
      x: targetPos.x + Helper.getRandomIntInclusive(-1, 1),
      y: targetPos.y + Helper.getRandomIntInclusive(-1, 1),
    }
    // let pos = {...targetPos}

    return kunai(engine, actor, pos)
  })],
})

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
  speed: 100,
  energy: 0,
  range: 30,
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
  clonePattern: Constant.CLONE_PATTERNS.bigSquare,
  // clonePattern: Constant.CLONE_PATTERNS.square,
})

export const waterball = (engine, actor, targetPos) => new Entity.DestructiveCloudProjectile({
  game: engine.game,
  targetPos,
  passable: true,
  pos: actor ? { x: actor.pos.x, y: actor.pos.y } : null,
  renderer: {
    // character: '~',
    character: '🌊',
    color: 'silver',
    background: 'lightslategrey',
  },
  name: TYPE.KUNAI,
  speed: 800,
  range: 10,
  clonePattern: Constant.CLONE_PATTERNS.bigSquare,
  // clonePattern: Constant.CLONE_PATTERNS.square,
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
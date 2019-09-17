import * as Entity from './entites';
import * as Constant from './constants';
import * as Helper from '../helper';

export const TYPE = {
  KUNAI: 'Kunai',
  SWORD: 'Sword',
}

export const kunaiCloud = ({engine, actor, targetPos, throwDirection}) => {
  let structure = Constant.CLONE_PATTERNS.bigSquare;

  let children = structure.positions.map((slot) => {
    let position = {
      x: actor.pos.x + slot.x + (throwDirection.x * structure.x_offset),
      y: actor.pos.y + slot.y + (throwDirection.y * structure.y_offset)
    }

    let targetPosition = {
      x: targetPos.x + slot.x,
      y: targetPos.y + slot.y,
    }

    return kunai(engine, position, targetPosition);
  })

  return new Entity.DestructiveCloudProjectileV2({
    game: engine.game,
    passable: true,
    speed: 500,
    children,
  })
}

export const kunai = (engine, pos, targetPos) => new Entity.DestructiveProjectile({
  game: engine.game,
  targetPos,
  passable: true,
  pos: { x: pos.x, y: pos.y },
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

export const fireball = (engine, actor, targetPos) => {
  return new Entity.DestructiveCloudProjectile({
    game: engine.game,
    owner_id: actor ? actor.id : null,
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
}

export const waterball = (engine, actor, targetPos) => new Entity.DestructiveCloudProjectile({
  game: engine.game,
  owner_id: actor ? actor.id : null,
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
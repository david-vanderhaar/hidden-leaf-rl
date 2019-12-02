// import deps
import * as Keymap from '../keymaps';
import * as Item from '../items';
import * as Entity from '../entites';
import * as Constant from '../constants';
import * as Action from '../actions';

// create class
export default function (engine) {
  const createSandWall = (engine, pos) => new Entity.Wall({
    game: engine.game,
    passable: false,
    pos: { x: pos.x, y: pos.y },
    renderer: {
      // character: '>',
      character: '✦️',
      color: '#A89078',
      background: '#D8C0A8',
    },
    name: Item.TYPE.BARRIER,
    durability: 3,
  })

  const sandWall = (engine, direction) => {
    let actor = engine.actors[engine.currentActor];
    let targetPositions = [];
    switch (Constant.getDirectionKey(direction)) {
      case 'N':
        
        break;
      case 'S':
        
        break;
      case 'E':
        
        break;
      case 'W':
        
        break;
    
      default:
        break;
    }
    let targetPositions = [
      // {
      //   x: actor.pos.x - 1,
      //   y: actor.pos.y - 1,
      // },
      {
        x: actor.pos.x,
        y: actor.pos.y - 1,
      },
      // {
      //   x: actor.pos.x + 1,
      //   y: actor.pos.y - 1,
      // },
      {
        x: actor.pos.x - 1,
        y: actor.pos.y,
      },
      {
        x: actor.pos.x + 1,
        y: actor.pos.y,
      },
      // {
      //   x: actor.pos.x - 1,
      //   y: actor.pos.y + 1,
      // },
      {
        x: actor.pos.x,
        y: actor.pos.y + 1,
      },
      // {
      //   x: actor.pos.x + 1,
      //   y: actor.pos.y + 1,
      // },
    ]
    actor.setNextAction(new Action.PlaceItems({
      targetPositions,
      entity: createSandWall(engine, { ...actor.pos }),
      game: engine.game,
      actor,
      energyCost: Constant.ENERGY_THRESHOLD
    }))
  }
  // define keymap
  const keymap = (engine) => {
    return {
      w: {
        activate: () => Keymap.walk(Constant.DIRECTIONS.N, engine),
        label: 'walk',
      },
      d: {
        activate: () => Keymap.walk(Constant.DIRECTIONS.E, engine),
        label: 'walk',
      },
      s: {
        activate: () => Keymap.walk(Constant.DIRECTIONS.S, engine),
        label: 'walk',
      },
      a: {
        activate: () => Keymap.walk(Constant.DIRECTIONS.W, engine),
        label: 'walk',
      },
      l: {
        activate: () => null,
        label: 'Sand Clone',
      },
      k: {
        activate: () => null,
        label: 'Sand Tomb',
      },
      j: {
        activate: () => null,
        label: 'Sand Skin',
      },
      h: {
        activate: () => sandWall(engine),
        label: 'Sand Wall',
      },
      o: {
        activate: () => null,
        label: 'Sand Volley',
      },
      i: {
        activate: () => Keymap.activateInventory(engine),
        label: 'Open Inventory',
      },
      q: {
        activate: () => Keymap.activateEquipment(engine),
        label: 'Open Equipment',
      },
      g: {
        activate: () => Keymap.activateDrop(engine),
        label: 'Drop Item',
      },
      p: {
        activate: () => Keymap.pickupRandom(engine),
        label: 'Pickup',
      },
      t: {
        activate: () => Keymap.activateThrowCursor(engine),
        label: 'Throw',
      },
      // DEV KEYS
      y: {
        activate: () => Keymap.addActor(engine.game),
        label: 'Add NPC',
      },
    };
  }


  let actor = new Entity.Player({
    pos: { x: 23, y: 7 },
    renderer: {
      character: 'G',
      color: '#F0D8C0',
      background: '#603030',
    },
    name: 'Gaara',
    actions: [],
    speed: 200,
    durability: 1,
    keymap: keymap(engine),
  })

  actor.container = [
    ...Array(10).fill('').map(() => Item.sandShuriken(engine, { ...actor.pos })),
  ]

  return actor;
}
// export instance
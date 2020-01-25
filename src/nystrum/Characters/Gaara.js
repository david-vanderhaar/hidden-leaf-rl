// import deps
import * as Item from '../items';
import * as Entity from '../entites';
import * as Constant from '../constants';
import * as Keymap from '../Keymap';

// create class
export default function (engine) {
  // define keymap
  const keymap = (engine) => {
    return {
      w: {
        activate: () => Keymap.walk(Constant.DIRECTIONS.N, engine),
        label: 'walk N',
      },
      e: {
        activate: () => Keymap.walk(Constant.DIRECTIONS.NE, engine),
        label: 'walk NE',
      },
      d: {
        activate: () => Keymap.walk(Constant.DIRECTIONS.E, engine),
        label: 'walk E',
      },
      c: {
        activate: () => Keymap.walk(Constant.DIRECTIONS.SE, engine),
        label: 'walk SE',
      },
      x: {
        activate: () => Keymap.walk(Constant.DIRECTIONS.S, engine),
        label: 'walk S',
      },
      z: {
        activate: () => Keymap.walk(Constant.DIRECTIONS.SW, engine),
        label: 'walk SW',
      },
      a: {
        activate: () => Keymap.walk(Constant.DIRECTIONS.W, engine),
        label: 'walk W',
      },
      q: {
        activate: () => Keymap.walk(Constant.DIRECTIONS.NW, engine),
        label: 'walk NW',
      },
      s: {
        activate: () => Keymap.none(engine),
        label: 'stay',
      },
      l: {
        activate: () => Keymap.sandClone(engine),
        label: 'Sand Clone',
      },
      k: {
        activate: () => Keymap.sandTomb(engine),
        label: 'Sand Tomb',
      },
      j: {
        activate: () => Keymap.sandSkin(engine, 2),
        label: 'Sand Skin',
      },
      h: {
        activate: () => Keymap.sandWall(engine),
        label: 'Sand Wall',
      },
      g: {
        activate: () => Keymap.sandPulse(engine),
        label: 'Sand Pulse',
      },
      i: {
        activate: () => Keymap.activateInventory(engine),
        label: 'Open Inventory',
      },
      o: {
        activate: () => Keymap.activateEquipment(engine),
        label: 'Open Equipment',
      },
      u: {
        activate: () => Keymap.activateDropItem(engine),
        label: 'Drop Item',
      },
      p: {
        activate: () => Keymap.pickupRandom(engine),
        label: 'Pickup',
      },
      t: {
        activate: () => Keymap.activateThrow(engine),
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
    durability: 15,
    cloneLimit: 3,
    keymap: keymap(engine),
    defense: 2,
  })

  actor.container = [
    Item.sword(engine),
    ...Array(100).fill('').map(() => Item.sandShuriken(engine, { ...actor.pos }, null, 20)),
    // ...Array(10).fill('').map(() => Item.fireballGas(engine, actor)),
    // ...Array(10).fill('').map(() => Item.movingSandWall(engine, { ...actor.pos })),
  ]

  return actor;
}
// export instance
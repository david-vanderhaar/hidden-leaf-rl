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
        activate: () => Keymap.sandClone(engine),
        label: 'Sand Clone',
      },
      k: {
        activate: () => Keymap.sandTomb(engine),
        label: 'Sand Tomb',
      },
      j: {
        activate: () => Keymap.sandSkin(engine, 10),
        label: 'Sand Skin',
      },
      h: {
        activate: () => Keymap.sandWall(engine),
        label: 'Sand Wall',
      },
      o: {
        activate: () => Keymap.sandPulse(engine),
        label: 'Sand Pulse',
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
    durability: 1,
    keymap: keymap(engine),
  })

  actor.container = [
    Item.sword(engine),
    ...Array(10).fill('').map(() => Item.sandShuriken(engine, { ...actor.pos })),
    // ...Array(10).fill('').map(() => Item.fireballGas(engine, actor)),
    // ...Array(10).fill('').map(() => Item.movingSandWall(engine, { ...actor.pos })),
  ]

  return actor;
}
// export instance
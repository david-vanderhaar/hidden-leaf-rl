// import deps
import * as Item from '../items';
import * as Entity from '../entites';
import * as Constant from '../constants';
import * as Keymap from '../Keymap';
import { createEightDirectionMoveOptions } from '../Keymap/helper';

// create class
export default function (engine) {
  // define keymap
  const keymap = (engine) => {
    return {
      ...createEightDirectionMoveOptions(Keymap.walk, engine),
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
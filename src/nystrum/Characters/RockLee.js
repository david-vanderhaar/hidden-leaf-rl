// import deps
import * as Item from '../items';
import * as Entity from '../entites';
import * as Constant from '../constants';
import * as Keymap from '../Keymap';

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
        activate: () => Keymap.activateFlyingLotus(engine),
        label: 'Flying Lotus',
      },
      k: {
        activate: () => Keymap.removeWeights(engine, 200),
        label: 'Remove wraps',
      },
      j: {
        activate: () => Keymap.drunkenFist(engine),
        label: 'Sip Sake',
      },
      h: {
        activate: () => Keymap.leafWhirlwind(engine),
        label: 'Leaf Whirlwind',
      },
      o: {
        activate: () => Keymap.openInnerGate(engine),
        label: 'Gate of Opening',
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
  // instantiate class
  let actor = new Entity.Player({
    pos: { x: 23, y: 7 },
    renderer: {
      character: 'R',
      color: '#e6e6e6',
      background: '#36635b',
    },
    name: 'Rock Lee',
    actions: [],
    speed: 400,
    durability: 3,
    keymap: keymap(engine),
  })

  // add default items to container
  actor.container = [
    ...Array(10).fill('').map(() => Item.kunai(engine, { ...actor.pos })),
  ]

  return actor;
}
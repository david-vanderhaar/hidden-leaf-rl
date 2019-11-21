// import deps
import * as Keymap from '../keymaps';
import * as Item from '../items';
import * as Entity from '../entites';
import * as Constant from '../constants';
import * as Action from '../actions';

export default function (engine) {
  // define keymap helpers
  const flyingLotus = (direction, stepCount, speedModifier, additionalAttackDamage, engine) => {
    let actor = engine.actors[engine.currentActor];
    actor.setNextAction(new Action.Tackle({
      direction,
      stepCount,
      game: engine.game,
      actor,
      additionalAttackDamage,
      energyCost: Math.floor(Constant.ENERGY_THRESHOLD / speedModifier),
    }))
  }

  const keymapFlyingLotus = (engine, initiatedBy, previousKeymap) => {
    const goToPreviousKeymap = () => initiatedBy.keymap = previousKeymap;
    return {
      Escape: {
        activate: goToPreviousKeymap,
        label: 'Close',
      },
      w: {
        activate: () => {
          flyingLotus(Constant.DIRECTIONS.N, 10, 2, 10, engine);
          goToPreviousKeymap();
        },
        label: 'activate N',
      },
      d: {
        activate: () => {
          flyingLotus(Constant.DIRECTIONS.E, 10, 2, 10, engine);
          goToPreviousKeymap();
        },
        label: 'activate E',
      },
      s: {
        activate: () => {
          flyingLotus(Constant.DIRECTIONS.S, 10, 2, 10, engine);
          goToPreviousKeymap();
        },
        label: 'activate S',
      },
      a: {
        activate: () => {
          flyingLotus(Constant.DIRECTIONS.W, 10, 2, 10, engine);
          goToPreviousKeymap();
        },
        label: 'activate W',
      },
    };
  }

  const activateFlyingLotus = (engine) => {
    let currentActor = engine.actors[engine.currentActor]
    currentActor.keymap = keymapFlyingLotus(engine, currentActor, {...currentActor.keymap});
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
        activate: () => activateFlyingLotus(engine),
        label: 'Flying Lotus',
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
    speed: 600,
    durability: 1,
    keymap: keymap(engine),
  })

  // add default items to container
  actor.container = [
    ...Array(10).fill('').map(() => Item.kunai(engine, { ...actor.pos })),
  ]

  return actor;
}
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

  const sandWall = (direction, engine) => {
    let actor = engine.actors[engine.currentActor];
    let targetPositions = [];
    let directionKey = Constant.getDirectionKey(direction);
    switch (directionKey) {
      case 'N':
        targetPositions = targetPositions.concat([
          {
            x: actor.pos.x - 1,
            y: actor.pos.y - 1,
          },
          {
            x: actor.pos.x,
            y: actor.pos.y - 1,
          },
          {
            x: actor.pos.x + 1,
            y: actor.pos.y - 1,
          },
        ]);
        break;
      case 'S':
        targetPositions = targetPositions.concat([
          {
            x: actor.pos.x - 1,
            y: actor.pos.y + 1,
          },
          {
            x: actor.pos.x,
            y: actor.pos.y + 1,
          },
          {
            x: actor.pos.x + 1,
            y: actor.pos.y + 1,
          },
        ]);
        break;
      case 'E':
        targetPositions = targetPositions.concat([
          {
            x: actor.pos.x + 1,
            y: actor.pos.y - 1,
          },
          {
            x: actor.pos.x + 1,
            y: actor.pos.y,
          },
          {
            x: actor.pos.x + 1,
            y: actor.pos.y + 1,
          },
        ]);
        break;
      case 'W':
        targetPositions = targetPositions.concat([
          {
            x: actor.pos.x - 1,
            y: actor.pos.y - 1,
          },
          {
            x: actor.pos.x - 1,
            y: actor.pos.y,
          },
          {
            x: actor.pos.x - 1,
            y: actor.pos.y + 1,
          },
        ]);
        break;
      default:
        break;
    }
    actor.setNextAction(new Action.PlaceItems({
      targetPositions,
      entity: createSandWall(engine, { ...actor.pos }),
      game: engine.game,
      actor,
      energyCost: Constant.ENERGY_THRESHOLD
    }))
  }

  const keymapSandWall = (engine, initiatedBy, previousKeymap) => {
    const goToPreviousKeymap = () => initiatedBy.keymap = previousKeymap;
    return {
      Escape: {
        activate: goToPreviousKeymap,
        label: 'Close',
      },
      w: {
        activate: () => {
          sandWall(Constant.DIRECTIONS.N, engine);
          goToPreviousKeymap();
        },
        label: 'activate N',
      },
      d: {
        activate: () => {
          sandWall(Constant.DIRECTIONS.E, engine);
          goToPreviousKeymap();
        },
        label: 'activate E',
      },
      s: {
        activate: () => {
          sandWall(Constant.DIRECTIONS.S, engine);
          goToPreviousKeymap();
        },
        label: 'activate S',
      },
      a: {
        activate: () => {
          sandWall(Constant.DIRECTIONS.W, engine);
          goToPreviousKeymap();
        },
        label: 'activate W',
      },
    };
  }

  const activateSandWall = (engine) => {
    let currentActor = engine.actors[engine.currentActor]
    currentActor.keymap = keymapSandWall(engine, currentActor, { ...currentActor.keymap });
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
        activate: () => activateSandWall(engine),
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
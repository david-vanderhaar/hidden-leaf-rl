// import deps
import * as Keymap from '../keymaps';
import * as Item from '../items';
import * as Entity from '../entites';
import * as Constant from '../constants';
import * as Action from '../actions';
import * as StatusEffect from '../statusEffects';
import { cloneDeep } from 'lodash';

// create class
export default function (engine) {
  // ------------ SAND WALL ----------------------
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

  // ------------ SAND PULSE ----------------------
  const triggerSandPulse = (direction, actor, engine) => {
    let cloud = Item.sandWallPulse({
      engine,
      actor,
      throwDirection: {
        x: direction[0],
        y: direction[1],
      },
      targetPos: { 
        x: actor.pos.x + (direction[0] * 10),
        y: actor.pos.y + (direction[1] * 10),
      },
    });
    
    if (cloud) {
      actor.setNextAction(
        new Action.PlaceActor({
          targetPos: {
            x: actor.pos.x + direction[0],
            y: actor.pos.y + direction[1],
          },
          entity: cloud,
          game: engine.game,
          actor,
          energyCost: Constant.ENERGY_THRESHOLD
        })
      )
    }
  }

  const keymapSandPulse = (engine, initiatedBy, previousKeymap) => {
    const goToPreviousKeymap = () => initiatedBy.keymap = previousKeymap;
    return {
      Escape: {
        activate: goToPreviousKeymap,
        label: 'Close',
      },
      w: {
        activate: () => {
          triggerSandPulse(Constant.DIRECTIONS.N, initiatedBy, engine);
          goToPreviousKeymap();
        },
        label: 'activate N',
      },
      d: {
        activate: () => {
          triggerSandPulse(Constant.DIRECTIONS.E, initiatedBy, engine);
          goToPreviousKeymap();
        },
        label: 'activate E',
      },
      s: {
        activate: () => {
          triggerSandPulse(Constant.DIRECTIONS.S, initiatedBy, engine);
          goToPreviousKeymap();
        },
        label: 'activate S',
      },
      a: {
        activate: () => {
          triggerSandPulse(Constant.DIRECTIONS.W, initiatedBy, engine);
          goToPreviousKeymap();
        },
        label: 'activate W',
      },
    };
  }

  const activateSandPulse = (engine) => {
    let currentActor = engine.actors[engine.currentActor]
    currentActor.keymap = keymapSandPulse(engine, currentActor, { ...currentActor.keymap });
  }

  // ------------ SAND TOMB ----------------------
  const triggerSandTomb = (engine, actor) => {
    let cursor = engine.actors[engine.currentActor];
    // let cloud = Item.sandBurst({
    let cloud = Item.sandTomb({
      engine,
      actor,
      targetPos: { ...cursor.pos },
    });
    if (cloud) {
      actor.setNextAction(
        new Action.PlaceActor({
          targetPos: {...cursor.pos},
          entity: cloud,
          game: engine.game,
          actor,
          energyCost: Constant.ENERGY_THRESHOLD
        })
      )
    }
  }

  const keymapSandTomb = (engine, initiatedBy, previousKeymap) => {
    const goToPreviousKeymap = () => {
      let cursor = engine.actors[engine.currentActor];
      cursor.active = false;
      engine.game.removeActor(cursor);
    };
    return {
      Escape: {
        activate: goToPreviousKeymap,
        label: 'Close',
      },
      w: {
        activate: () => Keymap.moveCursor(Constant.DIRECTIONS.N, engine),
        label: 'move',
      },
      d: {
        activate: () => Keymap.moveCursor(Constant.DIRECTIONS.E, engine),
        label: 'move',
      },
      s: {
        activate: () => Keymap.moveCursor(Constant.DIRECTIONS.S, engine),
        label: 'move',
      },
      a: {
        activate: () => Keymap.moveCursor(Constant.DIRECTIONS.W, engine),
        label: 'move',
      },
      k: {
        activate: () => {
          triggerSandTomb(engine, initiatedBy);
          goToPreviousKeymap();
        },
        label: 'activate'
      },
    };
  }

  const activateSandTomb = (engine) => {
    let currentActor = engine.actors[engine.currentActor]
    let game = engine.game;
    let pos = currentActor.pos;

    let cursor = new Entity.UI_Actor({
      initiatedBy: currentActor,
      pos,
      renderer: {
        character: '█',
        color: 'white',
        background: '',
      },
      name: 'Cursor',
      game,
      keymap: keymapSandTomb(engine, currentActor, { ...currentActor.keymap }),
    })
    engine.addActorAsPrevious(cursor);
    engine.setActorToPrevious(cursor);
    game.placeActorOnMap(cursor)
    game.draw()
  }

  // ------------ SAND SKIN ----------------------

  const sandSkin = (engine, durabilityBuff = 1) => {
    let currentActor = engine.actors[engine.currentActor];
    let effect = new StatusEffect.Base({
      game: engine.game,
      actor: currentActor,
      name: 'Sand Skin',
      lifespan: 1000,
      stepInterval: 100,
      allowDuplicates: false,
      onStart: () => {
        currentActor.durability += durabilityBuff;
        console.log(`${currentActor.name} was enveloped in hardened sand.`);
        currentActor.renderer.background = '#A89078'
      },
      onStop: () => {
        currentActor.durability = Math.max(1, currentActor.durability - durabilityBuff);
        console.log(`${currentActor.name}'s hardened sand skin fell away.`);
        currentActor.renderer.background = '#603030';
      },
    });
    currentActor.setNextAction(new Action.AddStatusEffect({
      effect,
      actor: currentActor,
      game: engine.game,
    }));
  }

  // ------------ SAND CLONE ----------------------
  const sandClone = (engine) => {
    let actor = engine.actors[engine.currentActor];
    let cloneKeymap = cloneDeep(actor.keymap);
    delete cloneKeymap['j'];
    delete cloneKeymap['k'];
    delete cloneKeymap['l'];
    let cloneArgs = [
      {
        attribute: 'renderer',
        value: { ...actor.renderer, background: '#A89078' }
      },
      {
        attribute: 'keymap',
        value: cloneKeymap
      }
    ];
    actor.setNextAction(new Action.CloneSelf({
      game: engine.game,
      actor,
      cloneArgs,
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
        activate: () => sandClone(engine),
        label: 'Sand Clone',
      },
      k: {
        activate: () => activateSandTomb(engine),
        label: 'Sand Tomb',
      },
      j: {
        activate: () => sandSkin(engine, 10),
        label: 'Sand Skin',
      },
      h: {
        activate: () => activateSandWall(engine),
        label: 'Sand Wall',
      },
      o: {
        activate: () => activateSandPulse(engine),
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
    // ...Array(10).fill('').map(() => Item.fireballGas(engine, actor)),
    // ...Array(10).fill('').map(() => Item.movingSandWall(engine, { ...actor.pos })),
  ]

  return actor;
}
// export instance
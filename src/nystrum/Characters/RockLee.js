// import deps
import * as Keymap from '../keymaps';
import * as Item from '../items';
import * as Entity from '../entites';
import * as Constant from '../constants';
import * as Action from '../actions';
import * as StatusEffect from '../statusEffects';
import * as Helper from '../../helper';

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

  const leafWhirlwind = (engine) => {
    let actor = engine.actors[engine.currentActor];
    let targetPositions = [
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
      {
        x: actor.pos.x - 1,
        y: actor.pos.y,
      },
      {
        x: actor.pos.x + 1,
        y: actor.pos.y,
      },
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
    ]
    console.log('leaf whirlwind!');
    
    actor.setNextAction(new Action.MultiTargetAttack({
      targetPositions,
      game: engine.game,
      actor,
      energyCost: (Constant.ENERGY_THRESHOLD * 8),
    }))
  }

  const drunkWalk = (direction, engine) => {
    let actor = engine.actors[engine.currentActor];
    let originalDirection = [...direction];
    let chance = Math.random();
    if (chance < 0.5) {
      console.log('drunk misstep');
      let count = 100
      while ((direction[0] === originalDirection[0] && direction[1] === originalDirection[1]) || count < 0) {
        count -= 1;
        direction = Constant.DIRECTIONS[Helper.getRandomInArray(Object.keys(Constant.DIRECTIONS))];
      }
      console.log(count);
    }

    let newX = actor.pos.x + direction[0];
    let newY = actor.pos.y + direction[1];
    actor.setNextAction(new Action.Move({
      targetPos: { x: newX, y: newY },
      game: engine.game,
      actor,
      energyCost: Constant.ENERGY_THRESHOLD
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
  
  const removeWraps = (engine, speedBoost = 600, damageDebuff = 1) => {
    let currentActor = engine.actors[engine.currentActor];

    let effect = new StatusEffect.Base({
      game: engine.game,
      actor: currentActor,
      name: 'Removed wraps (weights)',
      lifespan: 1000,
      stepInterval: 100,
      allowDuplicates: false,
      onStart: () => {
        currentActor.speed += speedBoost;
        currentActor.attackDamage = Math.max(0, currentActor.attackDamage - damageDebuff);
        currentActor.energy += speedBoost;
        console.log(`${currentActor.name} removed weighted wraps.`);
      },
      onStop: () => {
        currentActor.speed -= speedBoost;
        currentActor.attackDamage += damageDebuff;
        console.log(`${currentActor.name} rewrapped weights.`);
      },
    });
    currentActor.setNextAction(new Action.AddStatusEffect({
      effect,
      actor: currentActor,
      game: engine.game,
    }));
  }

  const openInnerGate = (engine) => {
    let currentActor = engine.actors[engine.currentActor];
    let nextGate = currentActor.setNextGate();
    if (nextGate) {
      let effect = new StatusEffect.Base({
        game: engine.game,
        actor: currentActor,
        name: nextGate.name,
        lifespan: -1,
        stepInterval: 100,
        allowDuplicates: false,
        onStart: () => {
          currentActor.speed += nextGate.speedBuff;
          currentActor.energy += nextGate.speedBuff;
          currentActor.attackDamage += nextGate.damageBuff;
          console.log(`${currentActor.name} opened the ${nextGate.name}.`);
          let nextGateToLabel = currentActor.getNextGate();
          if (nextGateToLabel) {
            currentActor.keymap.o.label = nextGateToLabel.name;
          } else {
            delete currentActor.keymap.o;
          }
        },
        onStep: () => {
          currentActor.decreaseDurability(nextGate.durabilityDebuff);
          currentActor.decreaseDurability(0);
          console.log(`${currentActor.name} suffers ${nextGate.durabilityDebuff} damage from physical stress.`)
        },
      });
      currentActor.setNextAction(new Action.AddStatusEffect({
        effect,
        actor: currentActor,
        game: engine.game,
      }));
    }
  }
  
  const drunkenFist = (engine, damageBuff = 1) => {
    let currentActor = engine.actors[engine.currentActor];

    let effect = new StatusEffect.Base({
      game: engine.game,
      actor: currentActor,
      name: 'Drunk',
      lifespan: 1000,
      stepInterval: 100,
      allowDuplicates: false,
      onStart: () => {
        currentActor.attackDamage += damageBuff;
        console.log(`${currentActor.name} took a sip of sake.`);
        currentActor.keymap.w = {
          activate: () => drunkWalk(Constant.DIRECTIONS.N, engine),
          label: 'drunken walk'
        }
        currentActor.keymap.a = {
          activate: () => drunkWalk(Constant.DIRECTIONS.W, engine),
          label: 'drunken walk'
        }
        currentActor.keymap.s = {
          activate: () => drunkWalk(Constant.DIRECTIONS.S, engine),
          label: 'drunken walk'
        }
        currentActor.keymap.d = {
          activate: () => drunkWalk(Constant.DIRECTIONS.E, engine),
          label: 'drunken walk'
        }
      },
      onStop: () => {
        currentActor.attackDamage -= damageBuff;
        console.log(`${currentActor.name} recovered from drunkeness.`);
        currentActor.keymap.w = {
          activate: () => Keymap.walk(Constant.DIRECTIONS.N, engine),
          label: 'walk'
        }
        currentActor.keymap.a = {
          activate: () => Keymap.walk(Constant.DIRECTIONS.W, engine),
          label: 'walk'
        }
        currentActor.keymap.s = {
          activate: () => Keymap.walk(Constant.DIRECTIONS.S, engine),
          label: 'walk'
        }
        currentActor.keymap.d = {
          activate: () => Keymap.walk(Constant.DIRECTIONS.E, engine),
          label: 'walk'
        }
      },
    });
    currentActor.setNextAction(new Action.AddStatusEffect({
      effect,
      actor: currentActor,
      game: engine.game,
    }));
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
      k: {
        activate: () => removeWraps(engine, 200),
        label: 'Remove wraps',
      },
      j: {
        activate: () => drunkenFist(engine),
        label: 'Sip Sake',
      },
      h: {
        activate: () => leafWhirlwind(engine),
        label: 'Leaf Whirlwind',
      },
      o: {
        activate: () => openInnerGate(engine),
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
  class RockLee extends Entity.Player {
    constructor({ currentGate = null, gates = [], ...args }) {
      super({ ...args })
      this.currentGate = currentGate;
      this.gates = [
        {
          name: 'Gate of Opening',
          damageBuff: 1,
          speedBuff: 100,
          durabilityDebuff: 1,
        },
        {
          name: 'Gate of Healing',
          damageBuff: 1,
          speedBuff: 100,
          durabilityDebuff: 1,
        },
        {
          name: 'Gate of Life',
          damageBuff: 1,
          speedBuff: 100,
          durabilityDebuff: 1,
        },
        {
          name: 'Gate of Pain',
          damageBuff: 1,
          speedBuff: 100,
          durabilityDebuff: 1,
        },
        {
          name: 'Gate of Limit',
          damageBuff: 1,
          speedBuff: 100,
          durabilityDebuff: 1,
        },
      ];
    }

    setNextGate () {
      let currentGate = this.currentGate;
      let nextGate = null;
      if (!currentGate) {
        nextGate =  this.gates[0];
        this.currentGate = {...nextGate};
      } else {
        let nextGateIndex = this.gates.findIndex((gate) => currentGate.name === gate.name) + 1;
        console.log('next gate index ', nextGateIndex);
        
        if (this.gates.length > nextGateIndex) { 
          nextGate = this.gates[nextGateIndex];
          this.currentGate = {...nextGate};
        }
      }
      return nextGate;
    }

    getNextGate () {
      let currentGate = this.currentGate;
      let nextGate = null;
      if (!currentGate) {
        nextGate =  this.gates[0];
      } else {
        let nextGateIndex = this.gates.findIndex((gate) => currentGate.name === gate.name) + 1;
        console.log('next gate index ', nextGateIndex);
        
        if (this.gates.length > nextGateIndex) { 
          nextGate = this.gates[nextGateIndex];
        }
      }
      return nextGate;
    }
  }

  let actor = new RockLee({
    pos: { x: 23, y: 7 },
    renderer: {
      character: 'R',
      color: '#e6e6e6',
      background: '#36635b',
    },
    name: 'Rock Lee',
    actions: [],
    speed: 600,
    durability: 100,
    keymap: keymap(engine),
  })

  // add default items to container
  actor.container = [
    ...Array(10).fill('').map(() => Item.kunai(engine, { ...actor.pos })),
  ]

  return actor;
}
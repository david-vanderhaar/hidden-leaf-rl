import { Tackle } from '../../actions';
import { ENERGY_THRESHOLD, DIRECTIONS, PARTICLE_TEMPLATES } from '../../constants';

const flyingLotus = (direction, stepCount, energyCost, additionalAttackDamage, engine) => {
  let actor = engine.actors[engine.currentActor];
  actor.setNextAction(new Tackle({
    direction,
    stepCount,
    game: engine.game,
    actor,
    additionalAttackDamage,
    energyCost,
    particleTemplate: PARTICLE_TEMPLATES.leaf
  }))
}

const keymapFlyingLotus = (engine, initiatedBy, previousKeymap) => {
  const energyCost = Math.floor(ENERGY_THRESHOLD / 2);
  const stepCount = Math.floor(initiatedBy.energy / energyCost) - 1;
  const additionalAttackDamage = stepCount;
  const goToPreviousKeymap = () => initiatedBy.keymap = previousKeymap;
  return {
    Escape: {
      activate: goToPreviousKeymap,
      label: 'Close',
    },
    w: {
      activate: () => {
        flyingLotus(DIRECTIONS.N, stepCount, energyCost, additionalAttackDamage, engine);
        goToPreviousKeymap();
      },
      label: 'activate N',
    },
    d: {
      activate: () => {
        flyingLotus(DIRECTIONS.E, stepCount, energyCost, additionalAttackDamage, engine);
        goToPreviousKeymap();
      },
      label: 'activate E',
    },
    s: {
      activate: () => {
        flyingLotus(DIRECTIONS.S, stepCount, energyCost, additionalAttackDamage, engine);
        goToPreviousKeymap();
      },
      label: 'activate S',
    },
    a: {
      activate: () => {
        flyingLotus(DIRECTIONS.W, stepCount, energyCost, additionalAttackDamage, engine);
        goToPreviousKeymap();
      },
      label: 'activate W',
    },
  };
}

export const activateFlyingLotus = (engine) => {
  let currentActor = engine.actors[engine.currentActor]
  currentActor.keymap = keymapFlyingLotus(engine, currentActor, { ...currentActor.keymap });
}
import { Tackle } from '../../actions';
import { ENERGY_THRESHOLD, DIRECTIONS } from '../../constants';

const flyingLotus = (direction, stepCount, speedModifier, additionalAttackDamage, engine) => {
  let actor = engine.actors[engine.currentActor];
  actor.setNextAction(new Tackle({
    direction,
    stepCount,
    game: engine.game,
    actor,
    additionalAttackDamage,
    energyCost: Math.floor(ENERGY_THRESHOLD / speedModifier),
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
        flyingLotus(DIRECTIONS.N, 10, 2, 10, engine);
        goToPreviousKeymap();
      },
      label: 'activate N',
    },
    d: {
      activate: () => {
        flyingLotus(DIRECTIONS.E, 10, 2, 10, engine);
        goToPreviousKeymap();
      },
      label: 'activate E',
    },
    s: {
      activate: () => {
        flyingLotus(DIRECTIONS.S, 10, 2, 10, engine);
        goToPreviousKeymap();
      },
      label: 'activate S',
    },
    a: {
      activate: () => {
        flyingLotus(DIRECTIONS.W, 10, 2, 10, engine);
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
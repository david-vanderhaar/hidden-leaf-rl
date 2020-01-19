import * as StatusEffect from '../../statusEffects';
import { AddStatusEffect } from '../../actions';

export const sandSkin = (engine, defenseBuff = 1) => {
  let currentActor = engine.actors[engine.currentActor];
  let effect = new StatusEffect.Base({
    game: engine.game,
    actor: currentActor,
    name: 'Sand Skin',
    lifespan: 500,
    stepInterval: 100,
    allowDuplicates: false,
    onStart: () => {
      currentActor.defense += defenseBuff;
      console.log(`${currentActor.name} was enveloped in hardened sand.`);
      currentActor.renderer.background = '#A89078'
    },
    onStop: () => {
      currentActor.defense = Math.max(0, currentActor.defense - defenseBuff);
      console.log(`${currentActor.name}'s hardened sand skin fell away.`);
      currentActor.renderer.background = '#603030';
    },
  });
  currentActor.setNextAction(new AddStatusEffect({
    effect,
    actor: currentActor,
    game: engine.game,
    particleTemplate: {
      renderer: {
        character: '✦️',
        color: '#A89078',
        background: '#D8C0A8',
      }
    },
  }));
}
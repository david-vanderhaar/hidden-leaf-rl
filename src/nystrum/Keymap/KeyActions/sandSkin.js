import * as StatusEffect from '../../statusEffects';
import { AddStatusEffect } from '../../actions';

export const sandSkin = (engine, durabilityBuff = 1) => {
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
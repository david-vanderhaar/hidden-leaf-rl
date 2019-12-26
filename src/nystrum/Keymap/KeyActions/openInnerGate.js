import * as StatusEffect from '../../statusEffects';
import { AddStatusEffect } from '../../actions';

export const openInnerGate = (engine) => {
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
    currentActor.setNextAction(new AddStatusEffect({
      effect,
      actor: currentActor,
      game: engine.game,
    }));
  }
}
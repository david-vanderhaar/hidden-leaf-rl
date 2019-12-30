import { MultiTargetAttack} from '../../actions';
import { ENERGY_THRESHOLD } from '../../constants';
import { Particle, ParticleEmitter } from '../../entites';

const particle = (engine, pos, direction) => new Particle({
  game: engine.game,
  name: 'particle',
  passable: true,
  pos,
  direction,
  energy: 100,
  renderer: {
    character: '*',
    color: 'white',
    background: 'black',
  },
})

export const leafWhirlwind = (engine) => {
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

  actor.setNextAction(new MultiTargetAttack({
    targetPositions,
    game: engine.game,
    actor,
    energyCost: (ENERGY_THRESHOLD * 8),
  }))

  // For Particles -----------------------------
  // let children = targetPositions.map((position) => {
  //   engine.game.particleEngine.addParticle({ life: 2, x: position.x, y: position.y})
  // })

  // let children = targetPositions.map((position) => {
  //   // let position = { x: actor.x, y: actor.y };
  //   let direction = { x: 0, y: 1 };
  //   return particle(engine, {...position}, direction);
  // })

  // let emitter = new ParticleEmitter({
  //   game: engine.game,
  //   passable: true,
  //   speed: children.length * 100,
  //   children,
  //   onDestroy: () => {
  //     console.log('on destroy callback');
  //     // V1
  //     actor.setNextAction(new MultiTargetAttack({
  //       targetPositions,
  //       game: engine.game,
  //       actor,
  //       energyCost: (ENERGY_THRESHOLD * 8),
  //     }))
  //     // V2
  //     // new MultiTargetAttack({
  //     //   targetPositions,
  //     //   game: engine.game,
  //     //   actor,
  //     //   energyCost: (ENERGY_THRESHOLD * 8),
  //     // }).perform();
  //     // engine.setActorToNext();
  //   }
  // })

  // engine.addActorAsNext(emitter);
  // engine.addActorAsPrevious(emitter);
  // engine.setActorToPrevious();
  // engine.setActorToPrevious();
}
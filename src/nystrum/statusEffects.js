export class Base {
  constructor({ 
    game, 
    actor, 
    name = 'Effect', 
    lifespan = 100,
    stepInterval = 100,
    onStart = () => null,
    onStep = () => null,
    onStop = () => null,
  }) {
    this.game = game
    this.actor = actor
    this.name = name
    this.lifespan = lifespan
    this.timeToLive = lifespan
    this.stepInterval = stepInterval
    this.timeSinceLastStep = 0;
    this.onStart = onStart
    this.onStep = onStep
    this.onStop = onStop
  }
}
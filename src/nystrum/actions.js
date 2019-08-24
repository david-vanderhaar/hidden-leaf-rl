export class Base {
  constructor(game, actor, energyCost) {
    this.actor = actor
    this.game = game
    this.energyCost = energyCost
  }

  perform() {
    console.log(`${this.actor.name} performs`)
    this.actor.energy -= this.energyCost;
    return {
      success: true,
      alternative: null,
    }
  }
}

export class Say extends Base {
  constructor(message, ...args) {
    super(...args);
    this.message = message
  }
  perform() {
    console.log(`${this.actor.name} says ${this.message}`);
    this.actor.energy -= this.energyCost;
    return {
      success: true,
      alternative: null,
    }
  }
};
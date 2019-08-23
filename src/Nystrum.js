import React from 'react';
import * as ROT from 'rot-js';
import * as Helper from './lib/helper'

export const getRandomInArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}

const ENERGY_THRESHOLD = 100;

class Engine {
  constructor() {
    this.actors = [];
    this.currentActor = 0;
    this.isRunning = false;
  }

  async process () {
    await Helper.delay(1000);
    let actor = this.actors[this.currentActor]
    actor.gainEnergy(actor.speed);
    if (actor.hasEnoughEnergy()) {
      let action = actor.getAction(actor);
      if (action === null) { return false; } // if no action given, kick out to UI input
      while (true) {
        let result = action.perform();
        if (!result.success) return false;
        if (result.alternative === null) break;
        action = result.alternative;
      }
    }
    this.currentActor = (this.currentActor + 1) % this.actors.length;
    return true
  }

  async start () {
    this.isRunning = true;
    let i = 0
    while (this.isRunning) {
      this.isRunning = await this.process();
    }
    // invoke UI input here, it should set next action of Hero and start() engine again.
  }

  stop () {
    this.isRunning = false;
  }
}

class Action {
  constructor (game, actor, energyCost) {
    this.actor = actor
    this.game = game
    this.energyCost = energyCost
  }

  perform () {
    console.log(`${this.actor.name} performs`)
    this.actor.energy -= this.energyCost;
    return {
      success: true,
      alternative: null,
    }
  }
}

class SayAction extends Action {
  constructor (game, actor, energyCost, message) {
    super(game, actor, energyCost);
    this.message = message
  }
  perform () {
    console.log(`${this.actor.name} says ${this.message}`);
    this.actor.energy -= this.energyCost;
    return {
      success: true,
      alternative: null,
    }
  }
}

class Actor {
  constructor (name, actions, speed, energy) {
    this.name = name;
    this.actions = actions;
    this.speed = speed;
    this.energy = energy;
    this.energyThreshold = ENERGY_THRESHOLD;
  }

  getAction () {
    let action = Helper.getRandomInArray(this.actions)
    if (action) { return action }
  }

  gainEnergy (value) {
    this.energy += value;
  }

  hasEnoughEnergy () {
    return this.energy >= this.energyThreshold;
  }
}

class Nystrum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount () {
    let new_engine = new Engine();
    let actor_1 = new Actor(
      'Billy',
      [],
      100,
      ENERGY_THRESHOLD,
    )
    let actor_2 = new Actor(
      'Bob',
      [],
      10,
      ENERGY_THRESHOLD,
    )
    actor_1.actions.push(new Action(null, actor_1, ENERGY_THRESHOLD))
    actor_1.actions.push(new SayAction(null, actor_1, ENERGY_THRESHOLD, 'Hey Im Billy'))
    actor_2.actions.push(new Action(null, actor_2, ENERGY_THRESHOLD))
    actor_2.actions.push(new SayAction(null, actor_1, ENERGY_THRESHOLD, 'Hey Im Bob'))
    new_engine.actors.push(actor_1)
    new_engine.actors.push(actor_2)
    console.log(new_engine);
    await new_engine.start()
    console.log(new_engine);
  }

  render() {
    return (
      <div className="Nystrum" tabIndex='0'>
        <div>Nystrum</div>
      </div>
    );
  }
}

export default Nystrum;

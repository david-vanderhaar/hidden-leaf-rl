import React from 'react';
import * as Constant from './constants';
import * as Engine from './engine';
import * as Action from './actions';
import * as Entity from './entites';
import * as Game from './game';

let ENGINE = new Engine.Engine();
let actor_1 = new Entity.Mover({
  pos: { x: 10, y: 10 },
  renderer: {
    character: 'B',
    color: 'white',
    background: 'black',
  },
  name: 'Billy',
  actions: [],
  speed: 80,
  energy: Constant.ENERGY_THRESHOLD,
})
let actor_2 = new Entity.Mover({
  pos: { x: 4, y: 1 },
  renderer: {
    character: 'B',
    color: 'white',
    background: 'black',
  },
  name:   'Bob',
  actions: [],
  speed: 70,
  energy: Constant.ENERGY_THRESHOLD,
})
let actor_3 = new Entity.Player({
  pos: { x: 1, y: 1 },
  renderer: {
    character: '@',
    color: 'orange',
    background: 'black',
  },
  name: 'Boomer',
  actions: [],
  speed: 100,
  energy: Constant.ENERGY_THRESHOLD,
  durability: 4,
})


ENGINE.actors.push(actor_1)
ENGINE.actors.push(actor_2)
ENGINE.actors.push(actor_3)

let game = new Game.Game({engine: ENGINE})

class Nystrum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.presserRef = React.createRef();
  }

  async componentDidMount () {
    game.initialize(this.presserRef)
    ENGINE.start()
  }

  render() {
    return (
      <div className="Nystrum">
        <h2>Nystrum</h2>
        { Game.DisplayElement(this.presserRef, Game.handleKeyPress, ENGINE) }
      </div>
    );
  }
}

export default Nystrum;

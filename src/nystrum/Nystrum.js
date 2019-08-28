import React from 'react';
import * as Constant from './constants';
import * as Engine from './engine';
import * as Action from './actions';
import * as Entity from './entites';
import * as Game from './game';
import * as Helper from '../helper';

let ENGINE = new Engine.Engine();

let actor_3 = new Entity.Player({
  pos: { x: 23, y: 7 },
  renderer: {
    character: '❂',
    color: 'orange',
    background: '',
  },
  name: 'Boomer',
  actions: [],
  speed: 500,
  durability: 4,
})

let actor_1 = new Entity.Chaser({
  targetEntity: actor_3,
  pos: { x: 10, y: 10 },
  renderer: {
    character: '◉',
    // character: '⛨',
    color: 'white',
    background: '',
  },
  name: 'Ross',
  actions: [],
  speed: 50,
})

let actor_2 = new Entity.Chaser({
  targetEntity: actor_3,
  pos: { x: 4, y: 1 },
  renderer: {
    character: '◉',
    // character: '⛨',
    color: 'white',
    background: '',
  },
  name: 'Bob',
  actions: [],
  speed: 500,
})

ENGINE.actors.push(actor_3)
ENGINE.actors.push(actor_1)
ENGINE.actors.push(actor_2)

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

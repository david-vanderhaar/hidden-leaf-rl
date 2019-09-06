import React from 'react';
import * as Keymap from './keymaps';
import * as Engine from './engine';
import * as Item from './items';
import * as Entity from './entites';
import * as Game from './game';

let ENGINE = new Engine.Engine();

let actor_3 = new Entity.Player({
  pos: { x: 23, y: 7 },
  renderer: {
    character: '❂',
    color: 'orange',
    background: '',
  },
  name: 'Player',
  actions: [],
  speed: 500,
  durability: 1,
  container: [
    Item.sword(ENGINE),
    Item.sword(ENGINE),
    Item.sword(ENGINE),
    Item.kunai(ENGINE),
    Item.kunai(ENGINE),
    Item.kunai(ENGINE),
  ],
  keyMap: Keymap.player(ENGINE),
})

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

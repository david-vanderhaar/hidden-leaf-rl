import React from 'react';
import { SCREENS } from './constants';
import * as Keymap from '../keymaps';
import * as Engine from '../engine';
import * as Item from '../items';
import * as Entity from '../entites';
import * as Game from '../game';
import Inventory from '../UI/Inventory';
import KeymapUI from '../UI/Keymap';

let ENGINE = new Engine.Engine({});

let actor_3 = new Entity.Player({
  pos: { x: 23, y: 7 },
  renderer: {
    character: '❂',
    color: 'orange',
    background: '',
  },
  name: 'Player',
  actions: [],
  speed: 600,
  durability: 1,
  keymap: Keymap.player(ENGINE),
})

actor_3.container = [
  Item.sword(ENGINE),
  Item.sword(ENGINE),
  Item.sword(ENGINE),
  // ...Array(10).fill('').map(() => Item.kunai(ENGINE)),
  ...Array(10).fill('').map(() => Item.fireballGas(ENGINE, actor_3)),
  // ...Array(10).fill('').map(() => Item.waterball(ENGINE)),
]

ENGINE.actors.push(actor_3)

let game = new Game.Game({ engine: ENGINE })

class Level extends React.Component {
  constructor(props) {
    super(props);
    console.log(game.showUI);
    
    this.state = {
      game: game,
    };
    this.presserRef = React.createRef();
  }

  async componentDidMount() {
    game.initialize(this.presserRef)
    game.updateReact = (newGameState) => { this.setState({game: newGameState}) }
    ENGINE.start()
  }

  render() {
    return (
      <div className="Level">
        <div className='flow-text'>Chunin Exams</div>
        <button className='btn' onClick={() => this.props.setActiveScreen(SCREENS.TITLE)}>Quit</button>
        <div className='row'>
          <Inventory inventory={this.state.game.visibleInventory} />
          <KeymapUI keymap={this.state.game.visibleKeymap} />
          {Game.DisplayElement(this.presserRef, Game.handleKeyPress, ENGINE)}
        </div>
      </div>
    );
  }
}

export default Level;

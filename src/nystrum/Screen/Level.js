import React from 'react';
import { SCREENS } from './constants';
import * as Engine from '../engine';
import * as Game from '../game';
import Equipment from '../UI/Equipment';
import Inventory from '../UI/Inventory';
import KeymapUI from '../UI/Keymap';
import RockLee from '../Characters/RockLee';
import NarutoUzumaki from '../Characters/NarutoUzumaki';
import Gaara from '../Characters/Gaara';

let ENGINE = new Engine.Engine({});

// let actor = NarutoUzumaki(ENGINE);
// let actor = RockLee(ENGINE);
let actor = Gaara(ENGINE);
ENGINE.actors.push(actor)

let game = new Game.Game({ engine: ENGINE })

class Level extends React.Component {
  constructor(props) {
    super(props);
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
          <Equipment equipment={this.state.game.visibleEquipment} />
          <Inventory inventory={this.state.game.visibleInventory} />
          <KeymapUI keymap={this.state.game.visibleKeymap} />
          {Game.DisplayElement(this.presserRef, Game.handleKeyPress, ENGINE)}
        </div>
      </div>
    );
  }
}

export default Level;

import React from 'react';
import * as Constant from './constants';
import * as Engine from './engine';
import * as Action from './actions';
import * as Entity from './entites';
import * as Game from './game';

class Nystrum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.presserRef = React.createRef();
  }

  async componentDidMount () {
    let new_engine = new Engine.Engine();
    let actor_1 = new Entity.Actor(
      'Billy',
      [],
      100,
      Constant.ENERGY_THRESHOLD,
    )
    let actor_2 = new Entity.Actor(
      'Bob',
      [],
      10,
      Constant.ENERGY_THRESHOLD,
    )
    let actor_3 = new Entity.Mover(
      {x: 0, y: 0},
      'Boomer',
      [],
      100,
      Constant.ENERGY_THRESHOLD,
    )
    actor_1.actions.push(new Action.Base(null, actor_1, Constant.ENERGY_THRESHOLD))
    actor_1.actions.push(new Action.Say(`Hey Im ${actor_1.name}`, null, actor_1, Constant.ENERGY_THRESHOLD))
    actor_2.actions.push(new Action.Base(null, actor_2, Constant.ENERGY_THRESHOLD))
    actor_2.actions.push(new Action.Say(`Yo Im ${actor_2.name}`, null, actor_2, Constant.ENERGY_THRESHOLD))
    new_engine.actors.push(actor_1)
    new_engine.actors.push(actor_2)
    new_engine.actors.push(actor_3)

    let game = new Game.Game(new_engine)
    game.initialize(this.presserRef)

    await new_engine.start()

  }

  render() {
    return (
      <div className="Nystrum">
        <h2>Nystrum</h2>
        { Game.DisplayElement(this.presserRef) }
      </div>
    );
  }
}

export default Nystrum;

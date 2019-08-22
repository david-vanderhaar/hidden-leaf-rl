import React from 'react';
import * as ROT from 'rot-js';
import * as Helper from './lib/helper'

const engine = () => {
  let state = {
    actors: [],
    currentActor: 0,
  };

  return {
    ...state,
    process: (state) => {
      let action = state.actors[state.currentActor].getAction();
      action.perform();
      state.currentActor = (state.currentActor + 1) % state.actors.length;
    },
  }
}

const action = () => {
  return {
    perform: () => {
      console.log('perform');
    }
  }
}

const createActor = (name) => {
  return {
    name,
    getAction: () => {
      return action();
    }
  }
}

class Nystrum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    let new_engine = engine();
    new_engine.actors.push(createActor('Billy'))
    new_engine.actors.push(createActor('Bob'))
    console.log(new_engine);
    new_engine.process(new_engine)
    new_engine.process(new_engine)
    new_engine.process(new_engine)
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

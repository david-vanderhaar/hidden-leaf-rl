import React from 'react';
import { SCREENS } from './constants';

class Title extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="Title">
        <div
          style={{
            width: '100vw',
            height: '100vh',
            backgroundColor: '#e2e2e2',
          }}
        >
          <div class='flow-text grey-text'>Hidden Leaf RL</div>
          {
            this.props.characters.map((character, index) => {
              let color = '';
              if (this.props.selectedCharacter) {
                color = this.props.selectedCharacter.name === character.name ? 'red' : ''
              }

              return (
                <button 
                  class={`btn ${color}`} 
                  onClick={() => this.props.setSelectedCharacter(character)}
                >
                  { character.name }
                </button>
              )
            })
          }
          <button class='btn' onClick={() => this.props.setActiveScreen(SCREENS.LEVEL)}>Play</button>
        </div>
      </div>
    );
  }
}

export default Title;
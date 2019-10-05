import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { SCREENS } from './Screen/constants';
import Level from './Screen/Level';
import Title from './Screen/Title';

class Nystrum extends React.Component {
  constructor() {
    super();
    this.state = {
      activeScreen: SCREENS.LEVEL,
    };
  }

  setActiveScreen (activeScreen) {
    this.setState({activeScreen})
  }

  getActiveScreen () {
    const titleScreen = <Title 
      key={SCREENS.TITLE} 
      setActiveScreen={this.setActiveScreen.bind(this)}
    />
    const levelScreen = <Level 
      key={SCREENS.LEVEL} 
      setActiveScreen={this.setActiveScreen.bind(this)}
    />

    switch (this.state.activeScreen) {
      case SCREENS.TITLE:
        return titleScreen
      case SCREENS.LEVEL:
        return levelScreen
      default:
        return titleScreen
    }
  }

  render() {
    const activeScreen = this.getActiveScreen();
    return (
      <div className="Nystrum">
        <ReactCSSTransitionGroup
          transitionName="fade"
          transitionAppear={true}
          transitionEnter={true}
          transitionLeave={true}
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          { activeScreen }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default Nystrum;

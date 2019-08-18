import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as ROT from 'rot-js';
import * as Entity from './lib/entity'
import * as Components from './components/index'

const TILES = {
  'GROUND': {
    background: '#974',
    foreground: '#aaa',
    character: '',
  }
}

const SHOW = (canvas) => {
  let d = document.getElementById('display')
  d.appendChild(canvas)
}

const CREATE_LEVEL = (world) => {
  let digger = new ROT.Map.Arena();
  let freeCells = [];
  let digCallback = function (x, y, value) {
    if (value) { return; }
    let key = x + "," + y;
    world.map[key] = {
      type: 'GROUND',
      entities: [],
    };
    freeCells.push(key);
  }
  digger.create(digCallback.bind(this));
}

const DRAW = (map, display) => {
  for (let key in map) {
    let parts = key.split(",");
    let x = parseInt(parts[0]);
    let y = parseInt(parts[1]);
    let tile = map[key];
    let { character, foreground, background } = TILES[tile.type]
    if (tile.entities.length > 0) {
      let entity = tile.entities[tile.entities.length - 1]
      character = entity.components.renderer.character
      foreground = entity.components.renderer.color
    }
    display.draw(x, y, character, foreground, background);
  }
}

let world = {
  objects: [{ pos: { x: 1, y: 0 } }],
  actors: [],
  map: {},
  display: new ROT.Display({ fontSize: 24, bg: '#099' }),
  canOccupy: (map, pos) => {
    // if (world.objects.filter((obj) => obj.pos.x === pos.x && obj.pos.y === pos.y).length === 0) {
    //   return true
    // } else {
    //   return false
    // }
    if (map.hasOwnProperty(`${pos.x},${pos.y}`)) {
      return true
    } else {
      return false
    }
  }
}



let o = {
  ...Entity.createEntity(1, '# One', {
    reciever: Components.receiver({ x: 10, y: 30 }),
    body: Components.body(world, { x: 19, y: 21 }),
    renderer: Components.renderer(world, '$'),
  }
  )
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
    this.presserRef = React.createRef();
  }

  handleKeyPress = (event, world, entity) => {
    let keyMap = {
      w: 0,
      d: 1,
      s: 2,
      a: 3,
    };

    let code = event.key;
    let dir = ROT.DIRS[4][keyMap[code]];
    /* one of numpad directions? */
    if (!(code in keyMap)) { return; }
    let newX = entity.components.body.pos.x + dir[0];
    let newY = entity.components.body.pos.y + dir[1];
    
    entity.sendEvent(
      entity, 'MOVE', { 
        currentPos: entity.components.body.pos, 
        targetPos: { 
          x: newX, 
          y: newY 
        } 
      }
    )
    return DRAW(world.map, world.display)

  }

  componentDidMount () {
    ROT.RNG.setSeed(7);
    SHOW(world.display.getContainer());
    CREATE_LEVEL(world);
    o.sendEvent(o, 'PREPARE_RENDER')
    DRAW(world.map, world.display)
    this.presserRef.current.focus();
  }

  render() {
    return (
      <div className="App" ref={this.presserRef} onKeyDown={(event) => this.handleKeyPress(event, world, o)} tabIndex='0'>
        <div id='display'></div>
      </div>
    );
  }
}

export default App;

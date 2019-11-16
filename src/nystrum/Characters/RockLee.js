// import deps
import * as Keymap from '../keymaps';
import * as Item from '../items';
import * as Entity from '../entites';


export default function (engine) {
  
  // define keymap
  
  // instantiate class
  let actor = new Entity.Player({
    pos: { x: 23, y: 7 },
    renderer: {
      character: 'R',
      color: '#e6e6e6',
      background: '#36635b',
      // background: '#2d3c3c',
    },
    name: 'Rock Lee',
    actions: [],
    speed: 600,
    durability: 1,
    keymap: Keymap.player(engine),
  })

  // add default items to container
  actor.container = [
    ...Array(10).fill('').map(() => Item.kunai(engine, { ...actor.pos })),
  ]

  return actor;
}
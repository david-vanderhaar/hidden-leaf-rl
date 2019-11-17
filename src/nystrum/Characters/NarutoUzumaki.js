// import deps
import * as Keymap from '../keymaps';
import * as Item from '../items';
import * as Entity from '../entites';
// create class
export default function (engine) {
  let actor = new Entity.Player({
    pos: { x: 23, y: 7 },
    renderer: {
      character: 'N',
      color: 'black',
      background: 'orange',
    },
    name: 'Naruto Uzumaki',
    actions: [],
    speed: 600,
    durability: 1,
    keymap: Keymap.player(engine),
  })

  actor.container = [
    Item.sword(engine),
    Item.sword(engine),
    Item.sword(engine),
    ...Array(10).fill('').map(() => Item.kunai(engine, { ...actor.pos })),
  ]

  return actor;
}
// export instance
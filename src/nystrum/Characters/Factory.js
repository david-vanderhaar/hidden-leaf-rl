let blueprint = {
  name: 'Test',
};

export function instantiate (blueprint) {
  let actor = new Entity.Player({
    pos: { x: 23, y: 7 },
    renderer: {
      character: 'G',
      color: '#F0D8C0',
      background: '#603030',
    },
    name: blueprint.name || 'None',
    actions: [],
    speed: blueprint.speed || 100,
    durability: blueprint.durability || 1,
    keymap: keymap(engine),
  })

  actor.container = [
    ...Array(10).fill('').map(() => Item.sandShuriken(engine, { ...actor.pos })),
    // ...Array(10).fill('').map(() => Item.fireballGas(engine, actor)),
    // ...Array(10).fill('').map(() => Item.movingSandWall(engine, { ...actor.pos })),
  ]

  return actor;
}
export const receiver = (pos) => {
  return {
    responded: false,
    RECIEVE: (parameters) => {
      let { self, component, message } = parameters
      console.log(message, pos.x, pos.y)
      if (!component.responded) {
        component.responded = true
        self.sendEvent(parameters.sender, 'hello', 'RECIEVE', { message: 'copy', sender: self })
      }
    }
  }
}

export const body = (world, pos = { x: 0, y: 0 }, stamina = 10) => {
  if (world) {
    return {
      pos,
      stamina,
      MOVE: (parameters) => {
        let { self, component, currentPos, targetPos } = parameters
        if (component.stamina > 0 && world.canOccupy(world.map, targetPos)) {
          component.pos = targetPos
          // component.stamina -= 1;
          let tile = world.map[`${currentPos.x},${currentPos.y}`]
          world.map[`${currentPos.x},${currentPos.y}`] = {...tile, entities: []}
          self.sendEvent(self, 'PREPARE_RENDER')
        } else {
          console.log('can\'t move there')
        }
      }
    }
  }
  console.log('No world to occupy');
  return {}
}

// export const renderer = (character = '', foreground = 'white', background = 'black') => {
//   return {
//     character,
//     foreground,
//     background,
//   }
// }

export const renderer = (world, character = '', color = 'white') => {
  return {
    character,
    color,
    PREPARE_RENDER: (parameters) => {
      let { self } = parameters
      if (self.components.hasOwnProperty('body')) {
        world.map[`${self.components.body.pos.x},${self.components.body.pos.y}`].entities.push(self)
      }
    }
  }
}
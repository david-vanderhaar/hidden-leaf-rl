export const ENERGY_THRESHOLD = 100;

export const TILE_KEY = {
  'GROUND': {
    background: '#363636',
    character: '',
    passable: true,
  },
  'WATER': {
    animation: [
      { background: '#363636', foreground: '#9dc3d3', character: '░', passable: false,},
      { background: '#363636', foreground: '#9dc3d3', character: '░', passable: false,},
      { background: '#363636', foreground: '#9dc3d3', character: '░', passable: false,},
      { background: '#363636', foreground: '#9dc3d3', character: '░', passable: false,},
      { background: '#363636', foreground: '#9dc3d3', character: '░', passable: false,},
      { background: '#363636', foreground: '#9dc3d3', character: '░', passable: false,},
      { background: '#363636', foreground: '#9dc3d3', character: '░', passable: false,},
      { background: '#363636', foreground: '#9dc3d3', character: '░', passable: false,},
      { background: '#363636', foreground: '#9dc3d3', character: '░', passable: false,},
      { background: '#363636', foreground: '#9dc3d3', character: '░', passable: false,},
      { background: '#363636', foreground: '#9dc3d3', character: '░', passable: false,},
      { background: '#363636', foreground: '#8aa', character: '▒', passable: false, },
      { background: '#363636', foreground: '#8aa', character: '▓', passable: false, },
    ],
    background: '#9dc3d3',
    character: '░',
    passable: false,
  },
  'WIN': {
    background: 'white',
    foreground: 'black',
    character: 'W',
    passable: true,
  }
}

export const HAND_SIGNS = {
  Power: {
    type: 'Power',
    name: 'Rin',
    description: 'Strength of mind, body, spirit',
  },
  Energy: {
    type: 'Energy',
    name: 'Pyo',
    description: 'energy direction',
  },
  Harmony: {
    type: 'Harmony',
    name: 'To',
    description: 'one- ness with the universe or self',
  },
  Healing: {
    type: 'Healing',
    name: 'Sha',
    description: 'of self and others',
  },
  Intuition: {
    type: 'Intuition',
    name: 'Kai',
    description: 'premonition of danger, feeling others intent',
  },
  Awareness: {
    type: 'Awareness',
    name: 'Jin',
    description: 'feeling thoughts of others, perhaps hiding your own',
  },
  Dimension: {
    type: 'Dimension',
    name: 'Retsu',
    description: 'control of time and space',
  },
  Creation: {
    type: 'Creation',
    name: 'Zai',
    description: 'understanding nature',
  },
  Absolute: {
    type: 'Absolute',
    name: 'Zen',
    description: 'enlightenment',
  }, 
}

export const DIRECTIONS = {
  N: [0, -1],
  S: [0, 1],
  E: [1, 0],
  W: [-1, 0],
}

export const EQUIPMENT_TYPES = {
  HEAD: 'HEAD',
  TORSO: 'TORSO',
  BACK: 'BACK',
  HAND: 'HAND',
  FEET: 'FEET',
}

export const EQUIPMENT_LAYOUTS = {
  human: () => {
    return [
      {type: EQUIPMENT_TYPES.HEAD, name: 'head', item: null},
      {type: EQUIPMENT_TYPES.TORSO, name: 'torso', item: null},
      {type: EQUIPMENT_TYPES.BACK, name: 'back', item: null},
      {type: EQUIPMENT_TYPES.HAND, name: 'left_hand', item: null},
      {type: EQUIPMENT_TYPES.HAND, name: 'right_hand', item: null},
      {type: EQUIPMENT_TYPES.FEET, name: 'feet', item: null},
    ]
  }
}
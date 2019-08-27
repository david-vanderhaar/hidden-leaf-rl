export const ENERGY_THRESHOLD = 100;

export const TILE_KEY = {
  'GROUND': {
    // background: '#5b684d',
    background: '#000',
    character: '',
    passable: true,
  },
  'WIN': {
    background: 'white',
    foreground: 'black',
    character: 'W',
    passable: true,
  }
}

export const DIRECTIONS = {
  N: [0, -1],
  S: [0, 1],
  E: [1, 0],
  W: [-1, 0],
}
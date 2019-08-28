import * as ROT from 'rot-js';

export const delay = (timeDelayed = 100) => {
  return new Promise(resolve => setTimeout(resolve, timeDelayed));
}

export const getRandomInArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}

export const coordsToString = (coords) => `${coords.x},${coords.y}`

export const calculatPath = (game, targetPos, currentPos, topology = 4) => {
  let map = game.map
  let isPassable = function (x, y) {
    if (map[x + "," + y]) {
      return (map[x + "," + y].type === 'GROUND');
    } else {
      return false
    }
  }
  let astar = new ROT.Path.AStar(targetPos.x, targetPos.y, isPassable, { topology });
  let path = [];
  astar.compute(currentPos.x, currentPos.y, function (x, y) {
    path.push({ x, y })
  });

  return path;
}
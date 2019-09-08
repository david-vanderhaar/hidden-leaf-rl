import * as ROT from 'rot-js';

export const delay = (timeDelayed = 100) => {
  return new Promise(resolve => setTimeout(resolve, timeDelayed));
}

export const getRandomInArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}

export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const coordsToString = (coords) => `${coords.x},${coords.y}`

export const calculatePath = (game, targetPos, currentPos, topology = 4) => {
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

  return path.slice(1);
}

export const calculatePathWithRange = (game, targetPos, currentPos, topology, range) => {
  let path = calculatePath(game, targetPos, currentPos, topology);
  return path.slice(0, range + 1);
}

export const getRandomPos = (map) => {
  let keys = Object.keys(map);
  let key = getRandomInArray(keys).split(',');
  let pos = { x: parseInt(key[0]), y: parseInt(key[1])}
  return {coordinates: pos, text: key}
}

export const getDestructableEntities = (entites) => {
  return entites.filter((entity) => entity.hasOwnProperty('durability'));
}
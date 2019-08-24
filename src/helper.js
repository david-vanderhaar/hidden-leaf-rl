export const delay = (timeDelayed = 100) => {
  return new Promise(resolve => setTimeout(resolve, timeDelayed));
}

export const getRandomInArray = (array) => {
  return array[Math.floor(Math.random() * array.length)];
}

export const coordsToString = (coords) => `${coords.x},${coords.y}`

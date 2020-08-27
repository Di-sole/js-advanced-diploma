export function calcTileType(index, boardSize) {
  // TODO: write logic here
  if (index === 0) {
    return 'top-left';
  }

  if (index === boardSize - 1) {
    return 'top-right';
  }

  if (index === boardSize ** 2 - boardSize) {
    return 'bottom-left';
  }

  if (index === boardSize ** 2 - 1) {
    return 'bottom-right';
  }

  if (index > 0 && index < boardSize - 1) {
    return 'top';
  }

  if (index > (boardSize ** 2 - boardSize) && index < (boardSize ** 2 - 1)) {
    return 'bottom';
  }

  if (index % boardSize === 0) {
    return 'left';
  }

  if ((index + 1) % boardSize === 0) {
    return 'right';
  }

  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function calcAllowedIndices(range) {
  let indices = [];

  if (range === 4) {
    indices = [
      [0, 4, 8],
      [1, 4, 7],
      [2, 4, 6],
      [3, 4, 5],
      [0, 1, 2, 3, 4, 5, 6, 7, 8],
      [3, 4, 5],
      [2, 4, 6],
      [1, 4, 7],
      [0, 4, 8],
    ];
  }

  if (range === 2) {
    indices = [
      [0, 2, 4],
      [1, 2, 3],
      [0, 1, 2, 3, 4],
      [1, 2, 3],
      [0, 2, 4],
    ];
  }

  if (range === 1) {
    indices = [
      [0, 1, 2],
      [0, 1, 2],
      [0, 1, 2],
    ];
  }

  return indices;
}

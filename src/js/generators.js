/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  const i = Math.floor(Math.random() * allowedTypes.length);
  const level = Math.floor(Math.random() * (maxLevel - 1 + 1)) + 1;

  yield new allowedTypes[i](level);
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const team = [];
  for (let i = 0; i < characterCount; i += 1) {
    const char = characterGenerator(allowedTypes, maxLevel).next().value;
    team.push(char);
  }

  return team;
}

// Generates allowed character's positions
export function generatePlayerPositions(boardSize = 8) {
  const positions = [];

  for (let i = 0; i < boardSize ** 2; i += 1) {
    if (i % boardSize === 0) {
      positions.push(i);
      positions.push(i + 1);
    }
  }

  return positions;
}

export function generateComputerPositions(boardSize = 8) {
  const positions = [];

  for (let i = 0; i < boardSize ** 2; i += 1) {
    if ((i + 1) % boardSize === 0) {
      positions.push(i - 1);
      positions.push(i);
    }
  }

  return positions;
}

// генерирует допустимые клетки для действия
// возвращает массив клеток, разбитых по колонкам
export function generateAllowedRange(index, range, boardSize = 8) {
  const currentLine = Math.floor(index / boardSize);
  const startLine = currentLine - range;

  const currentColumn = Math.floor(index - (currentLine * boardSize));
  const startColumn = currentColumn - range;
  const endColumn = currentColumn + range;

  const columns = [];
  let topLeftCell;
  let topRightCell;

  if (startColumn < 0) {
    topLeftCell = startLine * boardSize;
    topRightCell = boardSize * startLine + endColumn;
  } else if (endColumn >= boardSize) {
    topLeftCell = boardSize * startLine + startColumn;
    topRightCell = (startLine * boardSize) + (boardSize - 1);
  } else {
    topLeftCell = boardSize * startLine + startColumn;
    topRightCell = boardSize * startLine + endColumn;
  }

  const diameter = range * 2 + 1;

  for (let i = topLeftCell; i <= topRightCell; i += 1) {
    const column = [];
    for (let j = i; j < diameter * boardSize + i; j += boardSize) {
      column.push(j);
    }
    columns.push(column);
  }

  return columns;
}

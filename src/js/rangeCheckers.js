import { generateAllowedRange } from './generators';
import { calcAllowedIndices } from './utils';

export function checkAttackRange(attackerIndex, targetIndex, attackRange, boardSize) {
  const columns = generateAllowedRange(attackerIndex, attackRange, boardSize);
  const allowedCells = columns.flat(1);

  return allowedCells.some((elem) => elem === targetIndex);
}

export function checkMoveRange(startIndex, targetIndex, moveRange, boardSize) {
  const columns = generateAllowedRange(startIndex, moveRange, boardSize);
  const indices = calcAllowedIndices(moveRange);
  const allowedCells = [];

  const currentLine = Math.floor(startIndex / boardSize);
  const currentColumn = Math.floor(startIndex - (currentLine * boardSize));
  const startColumn = currentColumn - moveRange;

  if (startColumn >= 0) {
    for (let i = 0; i < columns.length; i += 1) {
      for (let j = 0; j < indices[i].length; j += 1) {
        const index = indices[i][j];
        allowedCells.push(columns[i][index]);
      }
    }
  } else {
    const diff = indices.length - columns.length;
    for (let i = columns.length - 1; i >= 0; i -= 1) {
      for (let j = indices[i + diff].length - 1; j >= 0; j -= 1) {
        const index = indices[i + diff][j];
        allowedCells.push(columns[i][index]);
      }
    }
  }

  return allowedCells.some((elem) => elem === targetIndex);
}

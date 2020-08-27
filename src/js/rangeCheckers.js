import { generateAllowedRange } from './generators';
import { calcAllowedIndices } from './utils';

export function checkAttackRange(attackerIndex, targetIndex, attackRange, boardSize = 8) {
  const columns = generateAllowedRange(attackerIndex, attackRange, boardSize);
  const cells = columns.flat(1);
  const allowedCells = cells.filter((elem) => elem >= 0 && elem < boardSize ** 2);

  return allowedCells.some((elem) => elem === targetIndex);
}

export function checkMoveRange(startIndex, targetIndex, moveRange, boardSize = 8) {
  const columns = generateAllowedRange(startIndex, moveRange, boardSize);
  const indices = calcAllowedIndices(moveRange);
  const cells = [];

  const currentLine = Math.floor(startIndex / boardSize);
  const currentColumn = Math.floor(startIndex - (currentLine * boardSize));
  const startColumn = currentColumn - moveRange;

  if (startColumn >= 0) {
    for (let i = 0; i < columns.length; i += 1) {
      for (let j = 0; j < indices[i].length; j += 1) {
        const index = indices[i][j];
        cells.push(columns[i][index]);
      }
    }
  } else {
    const diff = indices.length - columns.length;
    for (let i = columns.length - 1; i >= 0; i -= 1) {
      for (let j = indices[i + diff].length - 1; j >= 0; j -= 1) {
        const index = indices[i + diff][j];
        cells.push(columns[i][index]);
      }
    }
  }

  const allowedCells = cells.filter((elem) => elem >= 0 && elem < boardSize ** 2);

  return allowedCells.some((elem) => elem === targetIndex);
}

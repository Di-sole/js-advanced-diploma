import { playerTypes, computerTypes } from './allowedTypes';
import { generateTeam, generatePlayerPositions, generateComputerPositions } from './generators';
import PositionedCharacter from './PositionedCharacter';

export default class Team {
  constructor() {
    this.computerTeam = [];
    this.playerTeam = [];
  }

  get allCharacters() {
    return this.computerTeam.concat(this.playerTeam);
  }

  createComputerTeam(maxLevel, characterCount, boardSize = 8) {
    const team = generateTeam(computerTypes, maxLevel, characterCount);
    const positions = generateComputerPositions(boardSize);

    team.forEach((elem) => {
      const i = Math.floor(Math.random() * positions.length);
      this.computerTeam.push(new PositionedCharacter(elem, positions[i]));
      positions.splice(i, 1);
    });
  }

  createPlayerTeam(maxLevel, characterCount, boardSize = 8) {
    const team = generateTeam(playerTypes, maxLevel, characterCount);
    const positions = generatePlayerPositions(boardSize);

    team.forEach((elem) => {
      const i = Math.floor(Math.random() * positions.length);
      this.playerTeam.push(new PositionedCharacter(elem, positions[i]));
      positions.splice(i, 1);
    });
  }

  repositionPlayerTeam(boardSize = 8) {
    const positions = generatePlayerPositions(boardSize);

    for (let i = 0; i < this.playerTeam.length; i += 1) {
      const index = Math.floor(Math.random() * positions.length);
      this.playerTeam[i].position = positions[index];
      positions.splice(index, 1);
    }
  }
}

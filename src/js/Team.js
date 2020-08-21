import { playerTypes, computerTypes } from './allowedTypes';
import { generateTeam, generatePlayerPosition, generateComputerPosition } from './generators';
import PositionedCharacter from './PositionedCharacter';

export default class Team {
  constructor() {
    this.allCharacters = [];
    this.computerTeam = [];
    this.playerTeam = [];
  }

  createStartTeams(boardSize) {
    const playerTeam = generateTeam(playerTypes, 1, 2);
    const computerTeam = generateTeam(computerTypes, 1, 2);
    const arr1 = [];
    const arr2 = [];

    playerTeam.forEach((elem) => {
      const position = generatePlayerPosition(boardSize);
      arr1.push(new PositionedCharacter(elem, position));
    });

    computerTeam.forEach((elem) => {
      const position = generateComputerPosition(boardSize);
      arr2.push(new PositionedCharacter(elem, position));
    });

    this.allCharacters = arr1.concat(arr2);
    this.playerTeam = arr1;
    this.computerTeam = arr2;
  }
}

const team = new Team();
export { team };

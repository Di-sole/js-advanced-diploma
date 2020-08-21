export default class GameState {
  constructor() {
    this.activePlayer = 0;
    this.activeChar = '';
    this.activeCharIndex = 0;
    this.activeCellIndex = 0;
    this.isActive = false;
  }

  static from(object) {
    // TODO: create object
    return null;
  }
}

const gameState = new GameState();
export { gameState };

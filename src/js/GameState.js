export default class GameState {
  constructor() {
    this.activeChar = '';
    this.activeCharIndex = 0;
    this.activeCellIndex = 0;
    this.isActive = false;
    this.points = 0;
    this.maxPoints = 0;
    this.level = 1;
  }
}

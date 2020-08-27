import GamePlay from './GamePlay';
import GameState from './GameState';
import Character from './Character';
import Team from './Team';
import cursors from './cursors';
import getTheme from './themes';
import { checkAttackRange, checkMoveRange } from './rangeCheckers';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.team = new Team();
    this.state = new GameState();
  }

  init() {
    // TODO: add event listeners to gamePlay events
    this.gamePlay.drawUi(getTheme(1));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));
    // TODO: load saved stated from stateService
    const loadedState = this.stateService.load();
    if (loadedState) {
      this.state.maxPoints = loadedState.state.maxPoints;
    }
  }

  addOtherListeners() {
    if (this.gamePlay.cellClickListeners.length === 0) {
      this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    }

    if (this.gamePlay.cellEnterListeners.length === 0) {
      this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    }

    if (this.gamePlay.cellLeaveListeners.length === 0) {
      this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    }
  }

  onNewGameClick() {
    this.addOtherListeners();
    this.team.computerTeam = [];
    this.team.playerTeam = [];
    this.state.level = 1;
    this.state.points = 0;
    this.state.isActive = false;
    this.gamePlay.drawUi(getTheme(1));
    this.team.createPlayerTeam(1, 2);
    this.team.createComputerTeam(1, 2);
    this.gamePlay.redrawPositions(this.team.allCharacters);
  }

  onSaveGameClick() {
    // TODO
    if (this.team.playerTeam.length > 0 && this.team.computerTeam.length > 0) {
      this.saveGame();
      GamePlay.showMessage('Игра сохранена');
    } else {
      GamePlay.showMessage('Начните новую игру или продолжите сохраненную');
    }
  }

  onLoadGameClick() {
    // TODO4
    this.addOtherListeners();
    const loadedState = this.stateService.load();
    if (loadedState) {
      this.loadGame(loadedState);
    } else {
      GamePlay.showMessage('Нет сохраненных игр');
    }
  }

  onCellClick(index) {
    // TODO: react to click
    this.gamePlay.deselectCell(this.state.activeCharIndex);
    const target = this.team.allCharacters.find((elem) => elem.position === index);

    // если в поле есть персонаж
    if (target) {
      // если это персонаж игрока - установить активного персонажа
      if (this.team.playerTeam.some((elem) => elem === target)) {
        this.gamePlay.selectCell(index);
        this.state.isActive = true;
        this.state.activeCharIndex = index;
        this.state.activeChar = target;
      }

      // если это персонаж противника - проверить возможность и атаковать
      if (this.team.computerTeam.some((elem) => elem === target)) {
        if (this.state.isActive) {
          const range = this.state.activeChar.character.attackRange;
          const allowed = checkAttackRange(this.state.activeCharIndex, index, range);
          // атака
          if (allowed) {
            this.gamePlay.deselectCell(index);
            this.state.isActive = false;

            const { attack } = this.state.activeChar.character;
            const damage = Math.round(Math.max(attack - target.character.defence, attack * 0.1));

            this.gamePlay.showDamage(index, damage)
              .then(() => {
                target.character.health -= damage;
                return Promise.resolve(this.team.allCharacters);
              })
              .then((response) => {
                if (target.character.health > 0) {
                  this.gamePlay.redrawPositions(response);
                } else {
                  this.team.computerTeam.splice(this.team.computerTeam.indexOf(target), 1);
                  this.gamePlay.redrawPositions(this.team.allCharacters);
                }
                this.endTurn();
              });
          } else {
            this.state.isActive = false;
            GamePlay.showError('Противник слишком далеко');
          }
        } else {
          GamePlay.showError('Нельзя выбрать персонажа противника');
        }
      }
    }

    // если поле пустое - проверить возможность и сделать ход выбранным персонажем
    if (!target && this.state.isActive) {
      const range = this.state.activeChar.character.moveRange;
      const allowed = checkMoveRange(this.state.activeCharIndex, index, range);
      // ход
      if (allowed) {
        this.state.activeChar.position = index;
        this.gamePlay.redrawPositions(this.team.allCharacters);
        this.gamePlay.deselectCell(this.state.activeCellIndex);
        this.state.isActive = false;
        this.endTurn();
      } else {
        GamePlay.showError('В эту клетку нельзя пойти');
        this.state.isActive = false;
      }
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    this.gamePlay.setCursor(cursors.pointer);
    const target = this.team.allCharacters.find((elem) => elem.position === index);

    // если в поле есть персонаж - показать информацию о нём
    if (target) {
      const message = `${'\u{1F396}'}${target.character.level}${'\u{2694}'}${target.character.attack}${'\u{1F6E1}'}${target.character.defence}${'\u{2764}'}${target.character.health}`;
      this.gamePlay.showCellTooltip(message, index);

      // если это персонаж противника - проверить возможность атаки и установить курсор
      if (this.state.isActive && this.team.computerTeam.some((elem) => elem === target)) {
        const range = this.state.activeChar.character.attackRange;
        const allowed = checkAttackRange(this.state.activeCharIndex, index, range);
        if (allowed) {
          this.gamePlay.setCursor(cursors.crosshair);
          this.gamePlay.selectCell(index, 'red');
          this.state.activeCellIndex = index;
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      }
    }

    // в поле нет персонажа - проверить возможность хода и установить курсор
    if (!target && this.state.isActive) {
      const range = this.state.activeChar.character.moveRange;
      const allowed = checkMoveRange(this.state.activeCharIndex, index, range);
      if (allowed) {
        this.gamePlay.selectCell(index, 'green');
        this.state.activeCellIndex = index;
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.deselectCell(this.state.activeCellIndex);
    const target = this.team.allCharacters.find((elem) => elem.position === index);

    if (target) {
      this.gamePlay.hideCellTooltip(index);
    }
  }

  computerTurn() {
    let allowed = false;
    let attacker;
    let targetPosition;

    // найти доступного для атаки персонажа
    for (let i = 0; i < this.team.computerTeam.length; i += 1) {
      for (let j = 0; j < this.team.playerTeam.length; j += 1) {
        if (checkAttackRange(this.team.computerTeam[i].position,
          this.team.playerTeam[j].position,
          this.team.computerTeam[i].character.attackRange)) {
          allowed = true;
          attacker = this.team.computerTeam[i];
          targetPosition = this.team.playerTeam[j].position;
          break;
        }
      }
    }

    // атаковать, если такой персонаж есть
    if (allowed) {
      const target = this.team.playerTeam.find((elem) => elem.position === targetPosition);
      const damage = Math.max(attacker.character.attack - target.character.defence,
        attacker.character.attack * 0.1);

      this.gamePlay.showDamage(target.position, damage)
        .then(() => {
          target.character.health -= damage;
          return Promise.resolve(this.team.allCharacters);
        })
        .then((response) => {
          if (target.character.health > 0) {
            this.gamePlay.redrawPositions(response);
          } else {
            this.team.playerTeam.splice(this.team.playerTeam.indexOf(target), 1);
            this.gamePlay.redrawPositions(this.team.allCharacters);
          }

          if (this.team.playerTeam.length === 0) {
            this.gameOver();
          }
        });
    }

    // если невозможно атаковать - сделать ход
    if (!allowed) {
      this.enemyMove();
      this.gamePlay.redrawPositions(this.team.allCharacters);
    }
  }

  enemyMove() {
    const positions = [];
    this.team.computerTeam.forEach((elem) => positions.push(elem.position));
    const min = Math.min.apply(null, positions);
    const index = this.team.computerTeam.findIndex((elem) => elem.position === min);

    if (checkMoveRange(min, min - 1, 1)) {
      this.team.computerTeam[index].position -= 1;
    } else {
      this.team.computerTeam[index].position += 1;
    }
  }

  nextLevel() {
    this.state.level += 1;
    this.team.playerTeam.forEach((elem) => Character.levelUp.call(elem.character));

    const maxLevel = (this.state.level <= 2) ? 1 : this.state.level - 1;
    const amount = (this.state.level <= 2) ? 1 : 2;
    this.team.createPlayerTeam(maxLevel, amount);
    this.team.repositionPlayerTeam();

    this.team.createComputerTeam(this.state.level, this.team.playerTeam.length);

    this.gamePlay.drawUi(getTheme(this.state.level));
    this.gamePlay.redrawPositions(this.team.allCharacters);
  }

  gameOver() {
    this.blockBoard();
    GamePlay.showMessage('Вы проиграли');
  }

  endTurn() {
    if (this.team.computerTeam.length > 0 && this.team.playerTeam.length > 0) {
      this.computerTurn();
    }

    if (this.team.computerTeam.length === 0 && this.team.playerTeam.length > 0) {
      this.calcPoints();
      if (this.state.level === 4) {
        this.setMaxPoints();
        this.blockBoard();
        GamePlay.showMessage(`
          Вы победили!
          Ваш результат: ${this.state.points} баллов
          Лучший результат: ${this.state.maxPoints} баллов`);
      } else {
        this.nextLevel();
      }
    }
  }

  calcPoints() {
    let sum = 0;
    this.team.playerTeam.forEach((elem) => {
      sum += elem.character.health;
    });
    this.state.points += sum;
  }

  saveGame() {
    const currentState = {
      state: this.state,
      playerTeam: this.team.playerTeam,
      computerTeam: this.team.computerTeam,
    };

    this.stateService.save(currentState);
  }

  loadGame(loadedState) {
    this.state = loadedState.state;
    this.team.computerTeam = loadedState.computerTeam;
    this.team.playerTeam = loadedState.playerTeam;
    this.gamePlay.drawUi(getTheme(this.state.level));
    this.gamePlay.redrawPositions(this.team.allCharacters);
  }

  setMaxPoints() {
    this.state.maxPoints = Math.max(this.state.points, this.state.maxPoints);
    const loaded = this.stateService.load();
    if (loaded) {
      loaded.state.maxPoints = Math.max(this.state.points, loaded.state.maxPoints);
      this.stateService.save(loaded);
    }
  }

  blockBoard() {
    this.gamePlay.cellEnterListeners = [];
    this.gamePlay.cellLeaveListeners = [];
    this.gamePlay.cellClickListeners = [];
  }
}

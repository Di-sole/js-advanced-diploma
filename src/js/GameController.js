import themes from './themes';
import { team } from './Team';
import { playerTypes, computerTypes } from './allowedTypes';
import GamePlay from './GamePlay';
import { gameState } from './GameState';
import cursors from './cursors';
import { checkAttackRange, checkMoveRange } from './rangeCheckers';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    this.gamePlay.drawUi(themes.prairie);
    this.gamePlay.addNewGameListener(this.onNewGameClick);
    this.gamePlay.addSaveGameListener(this.onSaveGameClick);
    this.gamePlay.addLoadGameListener(this.onLoadGameClick);
    this.gamePlay.addCellClickListener(this.onCellClick);
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);

    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
    this.deselectCell(gameState.activeCharIndex);

    // если в поле есть персонаж
    if (event.target.hasChildNodes()) {
      const target = team.allCharacters.find((char) => char.position === index);

      // если это персонаж игрока - установить активного персонажа
      if (playerTypes.some((type) => target.character instanceof type)) {
        this.selectCell(index);
        gameState.isActive = true;
        gameState.activeCharIndex = index;
        gameState.activeChar = target;
      }

      // если это персонаж противника - проверить возможность и атаковать
      if (computerTypes.some((type) => target.character instanceof type)) {
        if (gameState.isActive) {
          const range = gameState.activeChar.character.attackRange;
          const allowed = checkAttackRange(gameState.activeCharIndex, index, range, this.boardSize);
          // атака
          if (allowed) {
            const { attack } = gameState.activeChar.character;
            const damage = Math.max(attack - target.character.defence, attack * 0.1);

            this.showDamage(index, damage)
              .then(() => {
                target.character.health -= damage;
                return Promise.resolve(team.allCharacters);
              })
              .then((response) => this.redrawPositions(response));

            this.deselectCell(index);
            gameState.isActive = false;
          } else {
            GamePlay.showError('Противник слишком далеко');
          }
        } else {
          GamePlay.showError('Нельзя выбрать персонажа противника');
        }
      }
    }

    // если поле пустое - проверить возможность и сделать ход выбранным персонажем
    if (!event.target.hasChildNodes()) {
      this.setCursor(cursors.pointer);
      if (gameState.isActive) {
        const range = gameState.activeChar.character.moveRange;
        const allowed = checkMoveRange(gameState.activeCharIndex, index, range, this.boardSize);
        // ход
        if (allowed) {
          gameState.activeChar.position = index;
          this.redrawPositions(team.allCharacters);
          this.deselectCell(gameState.activeCellIndex);
          gameState.isActive = false;
        } else {
          GamePlay.showError('В эту клетку нельзя пойти');
        }
      }
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    this.setCursor(cursors.pointer);

    // если в поле есть персонаж - показать информацию о нём
    if (event.target.hasChildNodes()) {
      const target = team.allCharacters.find((char) => char.position === index);
      const message = `${target.character.level} ${target.character.attack} ${target.character.defence} ${target.character.health}`;
      this.showCellTooltip(message, index);

      // если это персонаж противника - проверить возможность атаки и установить курсор
      if (gameState.isActive && computerTypes.some((type) => target.character instanceof type)) {
        const range = gameState.activeChar.character.attackRange;
        const allowed = checkAttackRange(gameState.activeCharIndex, index, range, this.boardSize);
        if (allowed) {
          this.setCursor(cursors.crosshair);
          this.selectCell(index, 'red');
          gameState.activeCellIndex = index;
        } else {
          this.setCursor(cursors.notallowed);
        }
      }
    }

    // в поле нет персонажа
    if (!event.target.hasChildNodes()) {
      // проверить возможность хода и установить курсор
      if (gameState.isActive) {
        const range = gameState.activeChar.character.moveRange;
        const allowed = checkMoveRange(gameState.activeCharIndex, index, range, this.boardSize);
        if (allowed) {
          this.selectCell(index, 'green');
          gameState.activeCellIndex = index;
        } else {
          this.setCursor(cursors.notallowed);
        }
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.deselectCell(gameState.activeCellIndex);

    if (event.target.hasChildNodes()) {
      this.hideCellTooltip(index);
    }
  }

  onNewGameClick() {
    this.deselectCell(gameState.activeCharIndex);
    gameState.isActive = false;

    team.createStartTeams(this.boardSize);
    this.redrawPositions(team.allCharacters);
  }

  // onSaveGameClick() {
  //   // TODO
  // }

  // onLoadGameClick() {
  //   // TODO
  // }
}

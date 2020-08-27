import { checkAttackRange, checkMoveRange } from '../rangeCheckers';
import Swordsman from '../characters/Swordsman';

test('переход на допустимую клетку', () => {
  const swordsman = new Swordsman();
  const bowmanIndex = 34;
  const targetIndex = 20;
  const received = checkMoveRange(bowmanIndex, targetIndex, swordsman.moveRange);

  expect(received).toBeTruthy();
});

test('переход на недопустимую клетку', () => {
  const swordsman = new Swordsman();
  const bowmanIndex = 34;
  const targetIndex = 30;
  const received = checkMoveRange(bowmanIndex, targetIndex, swordsman.moveRange);

  expect(received).toBeFalsy();
});

test('атака противника в пределах зоны поражения', () => {
  const swordsman = new Swordsman();
  const bowmanIndex = 34;
  const targetIndex = 27;
  const received = checkAttackRange(bowmanIndex, targetIndex, swordsman.attackRange);

  expect(received).toBeTruthy();
});

test('атака противника вне зоны поражения', () => {
  const swordsman = new Swordsman();
  const bowmanIndex = 34;
  const targetIndex = 36;
  const received = checkAttackRange(bowmanIndex, targetIndex, swordsman.attackRange);

  expect(received).toBeFalsy();
});

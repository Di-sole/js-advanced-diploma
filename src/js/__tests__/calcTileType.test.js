import { calcTileType } from '../utils';

test('отрисовка верхней левой ячейки', () => {
  expect(calcTileType(0, 8)).toBe('top-left');
});

test('отрисовка верхней правой ячейки', () => {
  expect(calcTileType(7, 8)).toBe('top-right');
});

test('отрисовка нижней левой ячейки', () => {
  expect(calcTileType(56, 8)).toBe('bottom-left');
});

test('отрисовка нижней правой ячейки', () => {
  expect(calcTileType(63, 8)).toBe('bottom-right');
});

test('отрисовка верхних ячеек', () => {
  expect(calcTileType(6, 8)).toBe('top');
});

test('отрисовка нижних ячеек', () => {
  expect(calcTileType(62, 8)).toBe('bottom');
});

test('отрисовка левых ячеек', () => {
  expect(calcTileType(48, 8)).toBe('left');
});

test('отрисовка правых ячеек', () => {
  expect(calcTileType(31, 8)).toBe('right');
});

test('отрисовка центральных ячеек', () => {
  expect(calcTileType(46, 8)).toBe('center');
});

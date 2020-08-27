import Character from '../Character';
import Bowman from '../characters/Bowman';

test('ошибка при создании объекта класса Character', () => {
  expect(() => new Character(1)).toThrowError(new Error('Нельза создавать персонажа через new Character'));
});

test('отсутствие ошибки при создании объекта класса Bowman', () => {
  expect(() => new Bowman(1)).not.toThrow();
});

test('создание персонажа класса Bowman', () => {
  const expected = {
    level: 1,
    attack: 25,
    defence: 25,
    health: 50,
    type: 'bowman',
    moveRange: 2,
    attackRange: 2,
  };

  expect(new Bowman(1)).toEqual(expected);
});

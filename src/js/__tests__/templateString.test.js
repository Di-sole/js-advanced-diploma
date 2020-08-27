import Bowman from '../characters/Bowman';

test('подсказка по характеристикам персонажа', () => {
  const bowman = new Bowman(1);
  const received = `${'\u{1F396}'}${bowman.level}${'\u{2694}'}${bowman.attack}${'\u{1F6E1}'}${bowman.defence}${'\u{2764}'}${bowman.health}`;
  const expected = '\u{1F396}1\u{2694}25\u{1F6E1}25\u{2764}50';

  expect(received).toBe(expected);
});

import GameStateService from '../../GameStateService';
import GamePlay from '../../GamePlay';

jest.mock('../../GamePlay');

beforeEach(() => {
  jest.resetAllMocks();
});

test('вывод сообщения при неуспешной загрузке', () => {
  const stateService = new GameStateService();

  const mock = jest.fn(() => {
    GamePlay.showError('Invalid state');
  });

  try {
    stateService.load(null);
  } catch (e) {
    mock();
  }

  expect(mock).toHaveBeenCalled();
});

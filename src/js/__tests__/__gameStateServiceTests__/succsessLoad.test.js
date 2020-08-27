import GameStateService from '../../GameStateService';

jest.mock('../../GameStateService');

beforeEach(() => {
  jest.resetAllMocks();
});

test('успешная загрузка игры', () => {
  const stateService = new GameStateService();
  stateService.load.mockReturnValue('state');

  expect(stateService.load()).toBe('state');
});

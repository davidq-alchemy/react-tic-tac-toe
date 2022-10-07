import { getWinner } from './GameContext';

describe('Game logic tests', () => {
  it('getWinner(): no winner', () => {
    expect(getWinner(
      [
        '', '', '',
        '', '', '',
        '', '', ''
      ]
    )).toEqual(undefined);

    expect(getWinner(
      [
        'X', 'X', 'Y',
        'Y', 'Y', 'X',
        'X', 'X', 'Y'
      ]
    )).toEqual(undefined);
  });

  it('getWinner(): winning rows', () => {
    expect(getWinner(
      [
        'X', 'X', 'X',
        '', '', '',
        '', '', ''
      ]
    )).toEqual('X');

    expect(getWinner(
      [
        '', '', '',
        'X', 'X', 'X',
        '', '', ''
      ]
    )).toEqual('X');

    expect(getWinner(
      [
        '', '', '',
        '', '', '',
        'X', 'X', 'X'
      ]
    )).toEqual('X');
  });

  it('getWinner(): winning columns', () => {
    expect(getWinner(
      [
        'Y', '', '',
        'Y', '', '',
        'Y', '', ''
      ]
    )).toEqual('Y');

    expect(getWinner(
      [
        '', 'Y', '',
        '', 'Y', '',
        '', 'Y', ''
      ]
    )).toEqual('Y');

    expect(getWinner(
      [
        '', '', 'Y',
        '', '', 'Y',
        '', '', 'Y'
      ]
    )).toEqual('Y');
  });

  it('getWinner(): winning diagonals', () => {
    expect(getWinner(
      [
        'Y', '', '',
        '', 'Y', '',
        '', '', 'Y'
      ]
    )).toEqual('Y');

    expect(getWinner(
      [
        '', '', 'X',
        '', 'X', '',
        'X', '', ''
      ]
    )).toEqual('X');
  });
});

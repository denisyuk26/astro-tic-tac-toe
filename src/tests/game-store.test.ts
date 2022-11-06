/**
 * @vitest-environment jsdom
 */

import { describe, it, expect } from 'vitest'
import { CurrentPlayer, GameStatus, store } from '../domain/stores/game.store'

describe('Game store', () => {
  it('should have initial values', () => {
    expect(store.get()).toEqual({
      id: 'tic-tac-toe',
      winConditions: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ],
      status: 'not-started',
      winCombination: [],
      currentPlayer: 'x',
      gameState: ['', '', '', '', '', '', '', '', ''],
      node: null,
    })
  })

  it('should change status to running', () => {
    store.setKey('status', GameStatus.Running)
    expect(store.get().status).toEqual('running')
  })

  it('should change status to win', () => {
    store.setKey('status', GameStatus.Win)
    expect(store.get().status).toEqual('win')
  })

  it('should change status to draw', () => {
    store.setKey('status', GameStatus.Draw)
    expect(store.get().status).toEqual('draw')
  })

  it('should change status to restart', () => {
    store.setKey('status', GameStatus.Restart)
    expect(store.get().status).toEqual('restart')
  })

  it('should change status to not-started', () => {
    store.setKey('status', GameStatus.NotStarted)
    expect(store.get().status).toEqual('not-started')
  })

  it('should change current player to x', () => {
    store.setKey('currentPlayer', CurrentPlayer.X)
    expect(store.get().currentPlayer).toEqual(CurrentPlayer.X)
  })

  it('should change current player to o', () => {
    store.setKey('currentPlayer', CurrentPlayer.O)
    expect(store.get().currentPlayer).toEqual(CurrentPlayer.O)
  })

  it('should change win combination', () => {
    store.setKey('winCombination', [0, 1, 2])
    expect(store.get().winCombination).toEqual([0, 1, 2])
  })

  it('should change game state', () => {
    store.setKey('gameState', ['x', 'o', 'x', '', '', '', '', '', ''])
    expect(store.get().gameState).toEqual([
      'x',
      'o',
      'x',
      '',
      '',
      '',
      '',
      '',
      '',
    ])
  })

  it('should change node', () => {
    store.setKey('node', document.createElement('div'))
    expect(store.get().node).toEqual(document.createElement('div'))
  })

  it('should reset store', () => {
    store.set({
      id: 'tic-tac-toe',
      winConditions: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ],
      status: GameStatus.NotStarted,
      winCombination: [],
      currentPlayer: CurrentPlayer.X,
      gameState: ['', '', '', '', '', '', '', '', ''],
      node: null,
    })
    expect({
      id: 'tic-tac-toe',
      winConditions: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ],
      status: GameStatus.NotStarted,
      winCombination: [],
      currentPlayer: CurrentPlayer.X,
      gameState: ['', '', '', '', '', '', '', '', ''],
      node: null,
    })
  })
})

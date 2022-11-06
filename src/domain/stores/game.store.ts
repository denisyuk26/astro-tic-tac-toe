import { map } from 'nanostores'

export enum GameStatus {
  Win = 'win',
  Draw = 'draw',
  Restart = 'restart',
  Running = 'running',
  NotStarted = 'not-started',
}

export enum CurrentPlayer {
  X = 'x',
  O = 'o',
}

interface GameStore {
  id: string
  winConditions: Array<number[]>
  status: GameStatus
  winCombination: number[]
  currentPlayer: CurrentPlayer
  gameState: string[]
  node: Element | null
}

export const initialValues: GameStore = {
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
}

export const store = map<GameStore>(initialValues)

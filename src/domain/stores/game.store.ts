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

export function changePlayer() {
  const { currentPlayer } = store.get()
  const updatedPlayer =
    currentPlayer === CurrentPlayer.X ? CurrentPlayer.O : CurrentPlayer.X
  store.setKey('currentPlayer', updatedPlayer)
}

export function changeWinState(winCondition: number[]) {
  store.setKey('winCombination', winCondition)
  store.setKey('status', GameStatus.Win)
}

export function changeDrawState() {
  store.setKey('status', GameStatus.Draw)
}

export function changeStartState() {
  store.setKey('status', GameStatus.Running)
}

export function changeRestartState() {
  store.setKey('status', GameStatus.Restart)
  store.set({
    ...store.get(),
    currentPlayer: CurrentPlayer.X,
    status: GameStatus.Running,
    gameState: ['', '', '', '', '', '', '', '', ''],
    winCombination: [],
  })
}

export function changeBoardState(element: Element, index?: number) {
  const { gameState, status, currentPlayer } = store.get()

  if (
    typeof index === 'undefined' ||
    gameState[index] !== '' ||
    status !== GameStatus.Running
  ) {
    return
  }

  const newGameState = [...gameState]
  newGameState[index] = currentPlayer
  store.setKey('gameState', newGameState)
  store.setKey('node', element)

  validateResult()
}

function validateResult() {
  const { winConditions, gameState, status } = store.get()

  let roundWon = status === GameStatus.Win
  for (let i = 0; i <= winConditions.length - 1; i++) {
    //check if all values in win condition are same
    const winCondition = winConditions[i]
    let a = gameState[winCondition[0]]
    let b = gameState[winCondition[1]]
    let c = gameState[winCondition[2]]

    //if all values are same and not empty
    if (a === '' || b === '' || c === '') {
      continue
    }
    //check if all cells are same
    if (a === b && b === c) {
      changeWinState(winCondition)
      localStorage.setItem('game_status', 'win')
      roundWon = true
      break
    }
  }

  if (roundWon) {
    return
  }

  if (!gameState.includes('')) {
    changeDrawState()
    return
  }

  changePlayer()
}

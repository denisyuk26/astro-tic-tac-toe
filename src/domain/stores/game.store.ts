import { atom, computed, map, MapStore } from 'nanostores'

export enum GameStatus {
  Win = 'win',
  Draw = 'draw',
  Running = 'running',
}

export enum Player {
  Cross = 'x',
  Circle = 'o',
}

export enum CellCoordinate {
  TopLeft = 0,
  TopCenter = 1,
  TopRight = 2,
  MiddleLeft = 3,
  MiddleCenter = 4,
  MiddleRight = 5,
  BottomLeft = 6,
  BottomCenter = 7,
  BottomRight = 8,
}

export enum CellValue {
  Empty = '',
  Cross = 'x',
  Circle = 'o',
}

export type GameState = Record<CellCoordinate, CellValue>

export type LastMoveState = [CellCoordinate, Player]

export type GameStateStore = MapStore<GameState>
type GameBoard = Record<CellCoordinate, CellValue>
export type Combination = [CellCoordinate, CellCoordinate, CellCoordinate]

function createEmptyGameBoard(): GameBoard {
  return {
    [CellCoordinate.TopLeft]: CellValue.Empty,
    [CellCoordinate.TopCenter]: CellValue.Empty,
    [CellCoordinate.TopRight]: CellValue.Empty,
    [CellCoordinate.MiddleLeft]: CellValue.Empty,
    [CellCoordinate.MiddleCenter]: CellValue.Empty,
    [CellCoordinate.MiddleRight]: CellValue.Empty,
    [CellCoordinate.BottomLeft]: CellValue.Empty,
    [CellCoordinate.BottomCenter]: CellValue.Empty,
    [CellCoordinate.BottomRight]: CellValue.Empty,
  }
}

function createGameStateStore(): GameStateStore {
  return map<GameState>(createEmptyGameBoard())
}

export function makeMove(coordinate: CellCoordinate): void {
  if (getGameStatus(gameStateStore.get()) !== GameStatus.Running) {
    return
  }

  if (coordinate < 0 || coordinate > 8) {
    throw new TypeError('Invalid coordinate')
  }

  const board = gameStateStore.get()
  const currentPlayer = currentPlayerStore.get()

  if (board[coordinate] !== CellValue.Empty) {
    return
  }

  const nextPlayer =
    currentPlayer === Player.Cross ? Player.Circle : Player.Cross
  const lastMove: LastMoveState = [coordinate, currentPlayer]
  const nextBoard = {
    ...board,
    [coordinate]: currentPlayer,
  }

  lastMoveStore.set(lastMove)
  gameStateStore.set(nextBoard)
  currentPlayerStore.set(nextPlayer)
}

export function restartGameStateStore(): void {
  currentPlayerStore.set(Player.Cross)
  gameStateStore.set(createEmptyGameBoard())
}

const POSSIBLE_COMBINATIONS: Combination[] = [
  [CellCoordinate.TopLeft, CellCoordinate.TopCenter, CellCoordinate.TopRight],
  [
    CellCoordinate.MiddleLeft,
    CellCoordinate.MiddleCenter,
    CellCoordinate.MiddleRight,
  ],
  [
    CellCoordinate.BottomLeft,
    CellCoordinate.BottomCenter,
    CellCoordinate.BottomRight,
  ],
  [
    CellCoordinate.TopLeft,
    CellCoordinate.MiddleLeft,
    CellCoordinate.BottomLeft,
  ],
  [
    CellCoordinate.TopCenter,
    CellCoordinate.MiddleCenter,
    CellCoordinate.BottomCenter,
  ],
  [
    CellCoordinate.TopRight,
    CellCoordinate.MiddleRight,
    CellCoordinate.BottomRight,
  ],
  [
    CellCoordinate.TopLeft,
    CellCoordinate.MiddleCenter,
    CellCoordinate.BottomRight,
  ],
  [
    CellCoordinate.TopRight,
    CellCoordinate.MiddleCenter,
    CellCoordinate.BottomLeft,
  ],
]

function isCombinationClosed(
  board: GameBoard,
  combination: Combination,
): boolean {
  return combination.every(
    (coordinate) => board[coordinate] !== CellValue.Empty,
  )
}

function isWinCombination(board: GameBoard, combination: Combination): boolean {
  const [first, second, third] = combination
  const firstValue = board[first]
  const secondValue = board[second]
  const thirdValue = board[third]

  return (
    firstValue !== CellValue.Empty &&
    firstValue === secondValue &&
    secondValue === thirdValue
  )
}

function getGameWinCombination(gameState: GameState): Combination | undefined {
  const board = gameState

  const closedCombinations = POSSIBLE_COMBINATIONS.filter((combination) =>
    isCombinationClosed(board, combination),
  )

  if (closedCombinations.length === 0) {
    return
  }

  const winCombination = closedCombinations.find((combination) =>
    isWinCombination(board, combination),
  )

  if (winCombination) {
    return winCombination
  }

  if (closedCombinations.length === POSSIBLE_COMBINATIONS.length) {
    return
  }

  return
}

function getGameStatus(gameState: GameState): GameStatus {
  const board = gameState

  const closedCombinations = POSSIBLE_COMBINATIONS.filter((combination) =>
    isCombinationClosed(board, combination),
  )

  if (closedCombinations.length === 0) {
    return GameStatus.Running
  }

  const winCombination = closedCombinations.find((combination) =>
    isWinCombination(board, combination),
  )

  if (winCombination) {
    return GameStatus.Win
  }

  if (closedCombinations.length === POSSIBLE_COMBINATIONS.length) {
    return GameStatus.Draw
  }

  return GameStatus.Running
}

function getGameWinner(store: GameState): Player | null {
  const board = store

  const closedCombinations = POSSIBLE_COMBINATIONS.filter((combination) =>
    isCombinationClosed(board, combination),
  )

  if (closedCombinations.length === 0) {
    return null
  }

  const winCombination = closedCombinations.find((combination) =>
    isWinCombination(board, combination),
  )

  if (!winCombination) {
    return null
  }

  if (board[winCombination[0]] === CellValue.Cross) {
    return Player.Cross
  }

  if (closedCombinations.length === POSSIBLE_COMBINATIONS.length) {
    return null
  }

  return Player.Circle
}

export const gameStateStore = createGameStateStore()

export const lastMoveStore = atom<LastMoveState | undefined>()

export const currentPlayerStore = atom<Player>(Player.Circle)

export const gameStatusStore = computed(gameStateStore, (gameState) =>
  getGameStatus(gameState),
)

export const gameWinnerStore = computed(gameStateStore, (gameState) =>
  getGameWinner(gameState),
)

export const gameWinCombinationStore = computed(gameStateStore, (gameState) =>
  getGameWinCombination(gameState),
)

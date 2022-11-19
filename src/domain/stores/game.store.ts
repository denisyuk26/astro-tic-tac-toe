import { atom, MapStore } from 'nanostores'

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
export type GameBoard = Record<CellCoordinate, CellValue>
export type Combination = [CellCoordinate, CellCoordinate, CellCoordinate]

export const gameStateStore = atom<GameBoard | undefined>()

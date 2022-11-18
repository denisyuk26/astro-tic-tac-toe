import {
  CellCoordinate,
  CellValue,
  Combination,
  GameStatus,
  Player,
} from '@domain/stores/game.store'
import { Socket } from 'socket.io-client'

class GameService {
  constructor() {}

  public async onGameStart(
    socket: Socket,
    listener: (message: {
      player: Player
      status: GameStatus
      board: Record<CellCoordinate, CellValue>
    }) => void,
  ) {
    socket.on(
      'start_game',
      (message: {
        player: Player
        status: GameStatus
        board: Record<CellCoordinate, CellValue>
      }) => listener(message),
    )
  }

  public async makeMove(
    socket: Socket,
    {
      coordinate,
    }: {
      coordinate: number
    },
  ) {
    await socket.emit('make_move', { coordinate })
  }

  public async onMakeMove(
    socket: Socket,
    listener: (message: {
      board: Record<CellCoordinate, CellValue>
      move: [CellCoordinate, Player]
    }) => void,
  ) {
    socket.on(
      'move_made',
      (message: {
        board: Record<CellCoordinate, CellValue>
        move: [CellCoordinate, Player]
      }) => listener(message),
    )
  }

  public async onGameWin(
    socket: Socket,
    listener: (mesasge: { user: Player; combination: Combination }) => void,
  ) {
    socket.on(
      'winner',
      (message: { user: Player; combination: Combination }) => {
        listener(message)
      },
    )
  }

  public async onGameDraw(socket: Socket, listener: () => void) {
    socket.on('draw', () => {
      listener()
    })
  }

  public async restartGame(socket: Socket) {
    socket.emit('restart_game')
  }

  public onGameRestarted(
    socket: Socket,
    listener: (message: {
      status: GameStatus
      player: Player
      board: Record<CellCoordinate, CellValue>
    }) => void,
  ) {
    socket.on('restarted_game', (message) => listener(message))
  }
}

const gameService = new GameService()

export default gameService

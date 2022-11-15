import { CellCoordinate, CellValue, Player } from '@domain/stores/game.store'
import { Socket } from 'socket.io-client'

class GameService {
  constructor() {}

  public async onGameStart(
    socket: Socket,
    listener: (message: { player: Player; status: string }) => void,
  ) {
    socket.on('start_game', listener)
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
    listener: (message: { coordinate: number }) => void,
  ) {
    socket.on('move_made', (message: { coordinate: number }) =>
      listener(message),
    )
  }

  public async restartGame(socket: Socket) {
    socket.emit('restart_game')
  }

  public onGameRestarted(
    socket: Socket,
    listener: (message: { player: Player; status: string }) => void,
  ) {
    socket.on('restarted_game', listener)
  }
}

const gameService = new GameService()

export default gameService

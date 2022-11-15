import { Player } from '@domain/stores/game.store'
import { RoomStatus } from '@domain/stores/lobby-store'
import { Socket } from 'socket.io-client'

class LobbyService {
  constructor() {}

  public async joinGameRoom(socket: Socket, roomId: string) {
    await socket.emit('join_room', roomId)
  }

  public onRoomJoined(
    socket: Socket,
    listener: (message: {
      id: string
      status: RoomStatus
      player: Player
    }) => void,
  ) {
    socket.on('room_joined', listener)
  }

  public async onRoomLeave(
    socket: Socket,
    listener: (message: { status: 'pending'; id: string }) => void,
  ) {
    socket.on('room_left', listener)
  }

  public async onLobbbyFull(socket: Socket, listen: (message: string) => void) {
    socket.on('join_error', listen)
  }
}

const lobbyService = new LobbyService()

export default lobbyService

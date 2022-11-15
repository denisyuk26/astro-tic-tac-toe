import lobbyService from '@domain/services/lobby-service'
import socketService from '@domain/services/socket-service'
import { currentPlayerStore } from '@domain/stores/game.store'
import {
  RoomStatus,
  roomStatus,
  updateRoomState,
} from '@domain/stores/lobby-store'
import { atom } from 'nanostores'
import {
  hideLobby,
  hideLobbyError,
  showLobbyError,
  srollToTopScreen,
} from './lobby-ui'

const createBtn = document.querySelector('.lobby-create-btn')
const input = document.getElementById('room_id')

const inputValue = atom<string | undefined>()

function joinRoom(id: string) {
  const socket = socketService.socket
  if (!socket) {
    throw new Error('socket is not connected')
  }
  lobbyService.joinGameRoom(socket, id)
}

function handleCreateRoom() {
  const value = inputValue.get()
  if (!value) {
    return
  }
  joinRoom(value)
}

function handleChange(e: Event) {
  const element = e.target as HTMLInputElement
  if (element) {
    inputValue.set(element.value)
  }
}

function handleFocus(e: Event) {
  hideLobbyError()
}

function init() {
  if (!createBtn) {
    throw new Error('wrong')
  }

  createBtn.addEventListener('click', handleCreateRoom)
  input?.addEventListener('input', handleChange)

  input?.addEventListener('focus', handleFocus)

  let clrearRoomStatusListener = roomStatus.listen((status) => {
    if (status === 'full' || status === 'pending') {
      hideLobby()
    }
  })

  return () => {
    createBtn.removeEventListener('click', handleCreateRoom)
    input?.removeEventListener('input', handleChange)
    clrearRoomStatusListener()
  }
}

init()

if (socketService.socket) {
  lobbyService.onRoomJoined(socketService.socket, (message) => {
    updateRoomState(message.status, message.id, message.player)
  })

  lobbyService.onRoomLeave(socketService.socket, (message) => {
    const player = currentPlayerStore.get()
    updateRoomState(message.status as RoomStatus, message.id, player)
    srollToTopScreen()
  })

  lobbyService.onLobbbyFull(socketService.socket, (message) => {
    showLobbyError(message)
  })
}

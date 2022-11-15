import {
  roomNameState,
  roomPlayer,
  roomStatus,
} from '@domain/stores/lobby-store'
import {
  showGameStartMessage,
  showLobbyInfo,
  showPendingMessage,
  showPlayer,
} from './lobby-info-ui'

function init() {
  let clearRoomNameStateListener = roomNameState.listen((roomName) => {
    if (roomName) {
      showLobbyInfo(roomName)
    }
  })

  let clearRoomPlayerListener = roomPlayer.listen((player) => {
    showPlayer(player)
  })

  let clearRoomPlayerStatusListener = roomStatus.listen((status) => {
    if (status === 'pending') {
      showPendingMessage()
    } else {
      showGameStartMessage()
    }
  })

  return () => {
    clearRoomNameStateListener()
    clearRoomPlayerListener()
    clearRoomPlayerStatusListener()
  }
}

init()

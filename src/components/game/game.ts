import gameService from '@domain/services/game-service'
import lobbyService from '@domain/services/lobby-service'
import socketService from '@domain/services/socket-service'
import { gameStateStore, Player } from '@domain/stores/game.store'
import { lobbyStore, roomPlayer } from '@domain/stores/lobby-store'

import {
  changeCellUI,
  changeDrawUI,
  changePlayerUI,
  changeRestartUI,
  changeStartUI,
  changeWinCombinationUI,
  changeWinUI,
  showGameBoardUI,
  disableGameBoardUI,
  enableGameBoardUI,
} from './game-ui'

const replayButton: HTMLElement | null = document.getElementById('replay-btn')
const recipeButton: HTMLElement | null = document.getElementById('recipe-btn')
const cellNodes: NodeListOf<Element> = document.querySelectorAll('.cell')

function handleCellClick(event: Event) {
  const clickedCell: HTMLDivElement = event.target as HTMLDivElement

  if (!clickedCell.dataset.coordinate) {
    throw new TypeError('could not find coordinate for cell')
  }
  const clickedValue: number = Number.parseInt(clickedCell.dataset.coordinate)
  if (socketService.socket) {
    gameService.makeMove(socketService.socket, {
      coordinate: clickedValue,
    })
  }
  disableGameBoardUI()
}

function handleChangeRestartState() {
  if (socketService.socket) {
    gameService.restartGame(socketService.socket)
  }

  localStorage.removeItem('game_status')
}

function handleRedirectToDish() {
  window.location.href = `${window.location.origin}/meal`
}

async function init() {
  // await socketService.connect('https://wsdata.herokuapp.com')
  await socketService.connect('localhost:3535')

  if (!replayButton || !recipeButton) {
    throw new Error('could not find elements')
  }

  cellNodes.forEach((cell) => cell.addEventListener('click', handleCellClick))
  replayButton.addEventListener('click', handleChangeRestartState)
  recipeButton.addEventListener('click', handleRedirectToDish)

  return () => {
    cellNodes.forEach((cell) =>
      cell.removeEventListener('click', handleCellClick),
    )

    replayButton.removeEventListener('click', handleChangeRestartState)
    recipeButton.removeEventListener('click', handleRedirectToDish)
  }
}

init()

if (socketService.socket) {
  lobbyService.onRoomLeave(socketService.socket, (message) => {
    changeRestartUI()

    if (socketService.socket) {
      gameStateStore.set(message.board)
    }
  })

  gameService.onGameStart(socketService.socket, (message) => {
    changeStartUI()
    showGameBoardUI()
    gameStateStore.set(message.board)

    if (message.status === 'running' && message.player === Player.Cross) {
      changePlayerUI(message.player)
      enableGameBoardUI()
    } else {
      disableGameBoardUI()
    }
  })

  gameService.onMakeMove(socketService.socket, (message) => {
    gameStateStore.set(message.board)

    const player = roomPlayer.get()
    if (player !== message.move[1]) {
      enableGameBoardUI()
    }

    const nextPlayer =
      message.move[1] === Player.Circle ? Player.Cross : Player.Circle
    changePlayerUI(nextPlayer)

    const cellNode = document.querySelector(
      '[data-coordinate="' + message.move[0] + '"]',
    )

    if (cellNode) {
      changeCellUI(message.move[1], cellNode)
    }
  })

  gameService.onGameWin(socketService.socket, (message) => {
    changeWinCombinationUI(message.combination)
    enableGameBoardUI()
    changeWinUI()
  })

  gameService.onGameDraw(socketService.socket, () => {
    enableGameBoardUI()
    changeDrawUI()
  })

  gameService.onGameRestarted(socketService.socket, (mesasge) => {
    gameStateStore.set(mesasge.board)
    changeRestartUI()
  })
}

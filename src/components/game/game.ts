import gameService from '@domain/services/game-service'
import lobbyService from '@domain/services/lobby-service'
import socketService from '@domain/services/socket-service'
import {
  currentPlayerStore,
  GameStatus,
  gameStatusStore,
  gameWinCombinationStore,
  gameWinnerStore,
  lastMoveStore,
  makeMove,
  Player,
  restartGameStateStore,
} from '@domain/stores/game.store'

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
  makeMove(clickedValue)
  if (socketService.socket) {
    gameService.makeMove(socketService.socket, {
      coordinate: clickedValue,
    })
  }
  disableGameBoardUI()
}

export function handleChangeStartState() {
  restartGameStateStore()
  changeStartUI()
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
  await socketService.connect('https://wsdata.herokuapp.com')

  if (!replayButton || !recipeButton) {
    throw new Error('could not find elements')
  }

  cellNodes.forEach((cell) => cell.addEventListener('click', handleCellClick))
  replayButton.addEventListener('click', handleChangeRestartState)
  recipeButton.addEventListener('click', handleRedirectToDish)

  let clearCurrentPlayerListener = currentPlayerStore.listen((player) => {
    changePlayerUI(player)
  })

  let clearGameWinCombinationListener = gameWinCombinationStore.listen(
    (combination) => {
      if (combination) {
        changeWinCombinationUI(combination)
      }
    },
  )

  let clearGameWinnerListener = gameWinnerStore.listen((player) => {
    if (player) {
      enableGameBoardUI()
    }
  })

  let clearGameStatusListener = gameStatusStore.listen((gameStatus) => {
    switch (gameStatus) {
      case GameStatus.Win:
        return changeWinUI()
      case GameStatus.Draw:
        return changeDrawUI()
    }
  })

  let clearLastMoveListener = lastMoveStore.listen((move) => {
    if (move) {
      const [cellCoordinate, player] = move

      const cellNode = document.querySelector(
        '[data-coordinate="' + cellCoordinate + '"]',
      )

      if (cellNode) {
        changeCellUI(player, cellNode)
      }
    }
  })

  return () => {
    cellNodes.forEach((cell) =>
      cell.removeEventListener('click', handleCellClick),
    )

    replayButton.removeEventListener('click', handleChangeRestartState)
    recipeButton.removeEventListener('click', handleRedirectToDish)

    clearGameStatusListener()
    clearCurrentPlayerListener()
    clearGameWinnerListener()
    clearGameWinCombinationListener()
    clearLastMoveListener()
  }
}

init()

if (socketService.socket) {
  lobbyService.onRoomLeave(socketService.socket, () => {
    if (socketService.socket) {
      gameService.restartGame(socketService.socket)
    }
  })

  gameService.onGameStart(socketService.socket, (message) => {
    handleChangeStartState()
    showGameBoardUI()
    if (message.status === 'running' && message.player === Player.Cross) {
      changePlayerUI(message.player)
      enableGameBoardUI()
    } else {
      disableGameBoardUI()
    }
  })

  gameService.onMakeMove(socketService.socket, (message) => {
    makeMove(message.coordinate)
    enableGameBoardUI()
  })

  gameService.onGameRestarted(socketService.socket, () => {
    restartGameStateStore()
    changeRestartUI()
  })
}

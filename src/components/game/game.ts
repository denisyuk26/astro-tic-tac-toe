import {
  currentPlayerStore,
  GameStatus,
  gameStatusStore,
  gameWinCombinationStore,
  gameWinnerStore,
  lastMoveStore,
  makeMove,
  restartGameStateStore,
} from '@domain/stores/game.store'
import {
  changeCellUI,
  changeDrawUI,
  changePlayerUI,
  changePlayerWinner,
  changeRestartUI,
  changeStartUI,
  changeWinCombinationUI,
  changeWinUI,
} from './game-ui'

const playButton: HTMLElement | null = document.getElementById('play-btn')
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
}

function handleChangeStartState() {
  restartGameStateStore()
  changeStartUI()
}

function handleChangeRestartState() {
  restartGameStateStore()
  changeRestartUI()
  localStorage.removeItem('game_status')
}

function handleRedirectToDish() {
  window.location.href = `${window.location.origin}/meal`
}

function init() {
  if (!playButton || !replayButton || !recipeButton) {
    throw new Error('could not find elements')
  }

  cellNodes.forEach((cell) => cell.addEventListener('click', handleCellClick))
  playButton.addEventListener('click', handleChangeStartState)
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
      changePlayerWinner(player)
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

    playButton.removeEventListener('click', handleChangeStartState)
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

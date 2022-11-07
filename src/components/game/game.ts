import {
  changeBoardState,
  changeRestartState,
  changeStartState,
  GameStatus,
  store,
} from '../../domain/stores/game.store'
import {
  changeCellUI,
  changeDrawUI,
  changePlayerUI,
  changeRestartUI,
  changeStartUI,
  changeWinUI,
} from './game-ui'

const playButton: HTMLElement | null = document.getElementById('play-btn')
const replayButton: HTMLElement | null = document.getElementById('replay-btn')
const recipeButton: HTMLElement | null = document.getElementById('recipe-btn')
const cellNodes: NodeListOf<Element> = document.querySelectorAll('.cell')

function handleCellClick(event: Event) {
  const clickedCell: HTMLDivElement = event.target as HTMLDivElement
  const clickedValue: number | undefined = clickedCell.dataset.index
    ? Number(clickedCell.dataset.index)
    : undefined

  changeCellUI(clickedCell)
  changeBoardState(clickedCell, clickedValue)
  changePlayerUI()

  if (store.get().status === GameStatus.Win) {
    changeWinUI()
  }

  if (store.get().status === GameStatus.Draw) {
    changeDrawUI()
  }
}

function handleChangeStartState() {
  changeStartState()
  changeStartUI()
}

function handleChangeRestartState() {
  changeRestartState()
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

  return () => {
    cellNodes.forEach((cell) =>
      cell.removeEventListener('click', handleCellClick),
    )

    playButton.removeEventListener('click', handleChangeStartState)
    replayButton.removeEventListener('click', handleChangeRestartState)
    recipeButton.removeEventListener('click', handleRedirectToDish)
  }
}

init()

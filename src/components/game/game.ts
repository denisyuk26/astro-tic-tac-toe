import {
  CurrentPlayer,
  GameStatus,
  store,
} from '../../domain/stores/game.store'
import { initUI } from './game-ui'

const playButton: HTMLElement | null = document.getElementById('play-btn')
const replayButton: HTMLElement | null = document.getElementById('replay-btn')
const recipeButton: HTMLElement | null = document.getElementById('recipe-btn')
const cellNodes: NodeListOf<Element> = document.querySelectorAll('.cell')

//Cell functions
function handleCellClick(event: Event) {
  const { gameState, status, currentPlayer } = store.get()
  const clickedCell: HTMLDivElement = event.target as HTMLDivElement
  const clickedValue: number | undefined = clickedCell.dataset.index
    ? Number(clickedCell.dataset.index)
    : undefined

  if (
    typeof clickedValue === 'undefined' ||
    gameState[clickedValue] !== '' ||
    status !== GameStatus.Running
  ) {
    return
  }

  //update game state
  const newGameState = [...gameState]
  newGameState[clickedValue] = currentPlayer
  store.setKey('gameState', newGameState)
  store.setKey('node', clickedCell)

  //check for result
  handleResultValidation()
}
function handleResultValidation() {
  const { winConditions, gameState, status } = store.get()

  let roundWon = status === GameStatus.Win
  for (let i = 0; i <= winConditions.length - 1; i++) {
    //check if all values in win condition are same
    const winCondition = winConditions[i]
    let a = gameState[winCondition[0]]
    let b = gameState[winCondition[1]]
    let c = gameState[winCondition[2]]

    //if all values are same and not empty
    if (a === '' || b === '' || c === '') {
      continue
    }
    //check if all cells are same
    if (a === b && b === c) {
      handleChangeWinState(winCondition)
      roundWon = true
      break
    }
  }

  if (roundWon) {
    return
  }

  if (!gameState.includes('')) {
    handleChangeDrawState()
    return
  }

  handlePlayerChange()
}
//End of Cell functions

//Status changing functions
function handleChangeWinState(winCondition: number[]) {
  store.setKey('winCombination', winCondition)
  store.setKey('status', GameStatus.Win)
  localStorage.setItem('game_status', 'win')
}

function handleChangeDrawState() {
  store.setKey('status', GameStatus.Draw)
}

function handleChangeStartState() {
  store.setKey('status', GameStatus.Running)
}

function handleChangeRestartState() {
  store.setKey('status', GameStatus.Restart)
  store.set({
    ...store.get(),
    currentPlayer: CurrentPlayer.X,
    status: GameStatus.Running,
    gameState: ['', '', '', '', '', '', '', '', ''],
    winCombination: [],
  })

  localStorage.removeItem('game_status')
}
//End of Status changing functions

function handlePlayerChange() {
  const { currentPlayer } = store.get()
  const updatedPlayer =
    currentPlayer === CurrentPlayer.X ? CurrentPlayer.O : CurrentPlayer.X
  store.setKey('currentPlayer', updatedPlayer)
}

function handleRedirectToDish() {
  window.location.href = `${window.location.origin}/meal`
}

function init() {
  if (!playButton || !replayButton || !recipeButton) {
    throw new Error('could not find elements')
  }

  initUI()
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

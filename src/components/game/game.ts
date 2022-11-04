import CrossSVG from '../../pages/assets/cross-svgrepo-com.svg'
import CircleSVG from '../../pages/assets/circle-doodle-svgrepo-com.svg'

export enum CurrentPlayer {
  X = 'x',
  O = 'o',
}

type GameState = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
]

const iconMap = {
  [CurrentPlayer.X]: CrossSVG,
  [CurrentPlayer.O]: CircleSVG,
}

function calculateWinDiraction(array: number[]) {
  const string = array.toString()
  switch (string) {
    case '0,1,2':
    case '3,4,5':
    case '6,7,8':
      return 'horizontal'
    case '0,3,6':
    case '1,4,7':
    case '2,5,8':
      return 'vertical'
    case '0,4,8':
      return 'diag_left'
    case '2,4,6':
      return 'diag_right'

    default:
      return ''
  }
}

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

let winCombination: number[] = []
const statusNode: HTMLElement | null = document.getElementById('game-status')
const dishBtn: HTMLElement | null = document.getElementById('dish-btn')
const cellNode = document.querySelectorAll('.cell')
const restartButton = document.getElementById('restart-btn')

let isGameRunning: boolean = true
let currentPlayer: CurrentPlayer = CurrentPlayer.X
let gameState: GameState = ['', '', '', '', '', '', '', '', '']

function handleCellClick(event: Event) {
  const clickedCell: HTMLDivElement = event.target as HTMLDivElement
  const clickedValue = clickedCell.dataset.index

  if (!clickedValue) {
    return
  }
  const clickedCellIndex = Number(clickedValue)
  if (gameState[clickedCellIndex] !== '' || !isGameRunning) {
    return
  }

  handleCellPlayed(clickedCell, clickedCellIndex)
  handleResultValidation()

  winCombination.forEach((index) => {
    cellNode[index].classList.add('victory')
  })
}

function handleCellPlayed(element: HTMLDivElement, index: number) {
  gameState[index] = currentPlayer
  const [, astroName] = element.classList

  element.innerHTML = `<img src="${iconMap[currentPlayer]}" class="${currentPlayer} ${astroName}"/>`
}

function handleResultValidation() {
  let roundWon = false
  for (let i = 0; i <= winningConditions.length - 1; i++) {
    const winCondition = winningConditions[i]
    let a = gameState[winCondition[0]]
    let b = gameState[winCondition[1]]
    let c = gameState[winCondition[2]]
    if (a === '' || b === '' || c === '') {
      continue
    }
    if (a === b && b === c) {
      winCombination = winCondition
      roundWon = true
      break
    }
  }
  if (!statusNode) {
    return
  }
  if (roundWon) {
    statusNode.innerHTML = sendWinMessage()
    isGameRunning = false
    return
  }

  if (!gameState.includes('')) {
    statusNode.innerHTML = sendDrawMessage()
    isGameRunning = false
    return
  }

  handlePlayerChange()
}

function handlePlayerChange() {
  currentPlayer =
    currentPlayer === CurrentPlayer.X ? CurrentPlayer.O : CurrentPlayer.X
  if (statusNode) {
    statusNode.innerHTML = sendCurrentPlayerTurnMessage()
  }
}

function handleRestartGame() {
  isGameRunning = true
  currentPlayer = CurrentPlayer.X
  gameState = ['', '', '', '', '', '', '', '', '']
  winCombination = []
  localStorage.removeItem('game_status')
  document.querySelectorAll('.cell').forEach((cell) => {
    cell.innerHTML = ''
    cell.classList.remove('victory')
  })
  if (statusNode) {
    statusNode.innerHTML = sendCurrentPlayerTurnMessage()
  }
  if (dishBtn) {
    dishBtn.classList.add('hidden')
  }
}

function sendWinMessage() {
  localStorage.setItem('game_status', 'win')
  if (dishBtn) {
    dishBtn.classList.remove('hidden')
  }
  return `Player ${currentPlayer.toUpperCase()} has won!`
}

function sendDrawMessage() {
  return 'Game ended in a draw'
}

function sendCurrentPlayerTurnMessage() {
  return `Player ${currentPlayer.toUpperCase()} turn`
}

function handleRedirectToDish() {
  window.location.href = `${window.location.origin}/meal`
}

function init() {
  cellNode.forEach((cell) => cell.addEventListener('click', handleCellClick))

  if (restartButton) {
    restartButton.addEventListener('click', handleRestartGame)
  }

  if (dishBtn) {
    dishBtn.addEventListener('click', handleRedirectToDish)
  }

  return () => {
    cellNode.forEach((cell) =>
      cell.removeEventListener('click', handleCellClick),
    )
    if (restartButton) {
      restartButton.removeEventListener('click', handleRestartGame)
    }
    if (dishBtn) {
      dishBtn.removeEventListener('click', handleRedirectToDish)
    }
  }
}

init()

import { Combination, Player } from '../../domain/stores/game.store'
import CircleSVG from '../../icons/circle.svg'
import CrossSVG from '../../icons/cross.svg'

const lobby: HTMLElement | null = document.querySelector('.lobby')
const replayButton: HTMLElement | null = document.getElementById('replay-btn')
const recipeButton: HTMLElement | null = document.getElementById('recipe-btn')
const cellNodes: NodeListOf<Element> = document.querySelectorAll('.cell')
const crossNode = document.querySelector('.left')
const circleNode = document.querySelector('.right')
const gameOverlay = document.querySelector('.game-overlay')
const gameContainer = document.querySelector('.game-container')

enum UIAction {
  Add = 'add',
  Remove = 'remove',
}

type UIData = [Element | null, string, UIAction]

function clearCellsUI(arrayNodes: NodeListOf<Element>) {
  arrayNodes.forEach((cell) => {
    cell.classList.remove('victory')
    cell.classList.remove('anim')
    cell.innerHTML = ''
  })
}

function applyActionOnElements(data: UIData[], delay: number = 0) {
  const timeout = setTimeout(() => {
    data.forEach(([element, className, action]) => {
      if (element) {
        element.classList[action](className)
      }
    })
  }, delay)

  return () => clearTimeout(timeout)
}

export function changePlayerUI(currentPlayer: Player) {
  if (!crossNode || !circleNode) {
    throw new Error('Could not find current player node')
  }

  if (currentPlayer === Player.Cross) {
    crossNode.classList.remove('hidden')
    circleNode.classList.add('hidden')
  } else {
    crossNode.classList.add('hidden')
    circleNode.classList.remove('hidden')
  }
}

export function changeWinCombinationUI(combination: Readonly<Combination>) {
  const timeout = setTimeout(() => {
    combination.forEach((coordinate) => {
      cellNodes[coordinate].classList.add('victory')
    })
  }, 500)

  return () => clearTimeout(timeout)
}

export function changeWinUI() {
  const data: UIData[] = [
    [gameOverlay, 'hide', UIAction.Remove],
    [recipeButton, 'hide', UIAction.Remove],
    [replayButton, 'hide', UIAction.Remove],
    [gameContainer, 'blur', UIAction.Add],
    [lobby, 'hide', UIAction.Add],
  ]

  applyActionOnElements(data, 1000)
}

export function changeDrawUI() {
  const data: UIData[] = [
    [gameOverlay, 'hide', UIAction.Remove],
    [replayButton, 'hide', UIAction.Remove],
    [recipeButton, 'hide', UIAction.Add],
    [lobby, 'hide', UIAction.Add],
    [gameContainer, 'blur', UIAction.Add],
    [circleNode, 'hidden', UIAction.Add],
    [crossNode, 'hidden', UIAction.Add],
  ]
  applyActionOnElements(data, 300)
}

export function changeRestartUI() {
  clearCellsUI(cellNodes)

  const data: UIData[] = [
    [gameOverlay, 'hide', UIAction.Add],
    [gameContainer, 'blur', UIAction.Remove],
    [recipeButton, 'hide', UIAction.Add],
    [replayButton, 'hide', UIAction.Add],
    [lobby, 'hide', UIAction.Add],
    [circleNode, 'hidden', UIAction.Add],
    [crossNode, 'hidden', UIAction.Remove],
  ]
  applyActionOnElements(data)

  if (!crossNode || !circleNode) {
    return
  }
  crossNode.innerHTML = '👈'
  circleNode.innerHTML = '👉'

  cellNodes.forEach((node) => {
    node.innerHTML = ''
  })
}

export function changeStartUI() {
  const data: UIData[] = [
    [gameOverlay, 'hide', UIAction.Add],
    [crossNode, 'hidden', UIAction.Remove],
    [gameContainer, 'blur', UIAction.Remove],
  ]
  applyActionOnElements(data)
}

export function changeCellUI(currentPlayer: Player, element: Element) {
  const iconMap: Record<Player, string> = {
    [Player.Cross]: CrossSVG,
    [Player.Circle]: CircleSVG,
  }

  const [, astroName] = element.classList.value.split(' ')

  element.classList.add('anim')

  const timeout = setTimeout(() => {
    element.innerHTML = `<img src="${iconMap[currentPlayer]}" class="${currentPlayer} ${astroName}"/>`
  }, 300)

  return () => clearTimeout(timeout)
}

export function showGameBoardUI() {
  document.querySelector('.game-board')?.classList.remove('hide')
}
export function disableGameBoardUI() {
  document.querySelector('.game-container')?.classList.remove('active')
}
export function enableGameBoardUI() {
  document.querySelector('.game-container')?.classList.add('active')
}

export function startGameUI() {}

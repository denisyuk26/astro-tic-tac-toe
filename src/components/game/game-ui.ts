import CrossSVG from '../../icons/cross.svg'
import CircleSVG from '../../icons/circle.svg'
import {
  CurrentPlayer,
  GameStatus,
  store,
} from '../../domain/stores/game.store'

const playButton: HTMLElement | null = document.getElementById('play-btn')
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

function changePlayerUI() {
  const { currentPlayer } = store.get()
  if (!crossNode || !circleNode) {
    return
  }
  if (currentPlayer === CurrentPlayer.X) {
    crossNode.classList.remove('hidden')
    circleNode.classList.add('hidden')
  } else {
    crossNode.classList.add('hidden')
    circleNode.classList.remove('hidden')
  }
}

function changeWinUI() {
  const { currentPlayer } = store.get()
  const data: UIData[] = [
    [gameOverlay, 'hide', UIAction.Remove],
    [recipeButton, 'hide', UIAction.Remove],
    [replayButton, 'hide', UIAction.Remove],
    [gameContainer, 'blur', UIAction.Add],
    [playButton, 'hide', UIAction.Add],
  ]

  changeElementsUI(data, 300)
  changeWinCombinationUI(cellNodes, store.get().winCombination, 'victory')
  if (!crossNode || !circleNode) {
    return
  }
  circleNode.classList.remove('hidden')
  crossNode.classList.remove('hidden')

  if (currentPlayer === CurrentPlayer.X) {
    crossNode.innerHTML = '👑'
    circleNode.innerHTML = '😭'
  } else {
    circleNode.innerHTML = '👑'
    crossNode.innerHTML = '😭'
  }
}

function changeDrawUI() {
  const data: UIData[] = [
    [gameOverlay, 'hide', UIAction.Remove],
    [replayButton, 'hide', UIAction.Remove],
    [recipeButton, 'hide', UIAction.Add],
    [playButton, 'hide', UIAction.Add],
    [gameContainer, 'blur', UIAction.Add],
    [circleNode, 'hidden', UIAction.Add],
    [crossNode, 'hidden', UIAction.Add],
  ]
  changeElementsUI(data)
}

function changeRestartUI() {
  clearCellsUI(cellNodes)

  const data: UIData[] = [
    [gameOverlay, 'hide', UIAction.Add],
    [gameContainer, 'blur', UIAction.Remove],
    [recipeButton, 'hide', UIAction.Add],
    [replayButton, 'hide', UIAction.Add],
    [playButton, 'hide', UIAction.Add],
    [circleNode, 'hidden', UIAction.Add],
    [crossNode, 'hidden', UIAction.Remove],
  ]
  changeElementsUI(data)
  if (!crossNode || !circleNode) {
    return
  }
  crossNode.innerHTML = '👈'
  circleNode.innerHTML = '👉'
}

function changeStartUI() {
  const data: UIData[] = [
    [gameOverlay, 'hide', UIAction.Add],
    [crossNode, 'hidden', UIAction.Remove],
    [gameContainer, 'blur', UIAction.Remove],
  ]
  changeElementsUI(data)
}

function changeCellUI(element: Element | null) {
  if (!element) {
    throw new Error('Element is null')
  }
  const iconMap = {
    [CurrentPlayer.X]: CrossSVG,
    [CurrentPlayer.O]: CircleSVG,
  }
  const { currentPlayer } = store.get()
  const [, astroName] = element.classList

  element.classList.add('anim')
  const timeout = setTimeout(() => {
    element.innerHTML = `<img src="${iconMap[currentPlayer]}" class="${currentPlayer} ${astroName}"/>`
  }, 300)
  return () => clearTimeout(timeout)
}

export function changeElementsUI(data: UIData[], delay: number = 0) {
  const timeout = setTimeout(() => {
    data.forEach(([element, className, action]) => {
      if (element) {
        element.classList[action](className)
      }
    })
  }, delay)

  return () => clearTimeout(timeout)
}

function changeWinCombinationUI(
  arrayNodes: NodeListOf<Element>,
  winCombination: number[],
  className: string,
) {
  const timeout = setTimeout(() => {
    winCombination.forEach((index) => {
      arrayNodes[index].classList.add(className)
    })
  }, 500)

  return () => clearTimeout(timeout)
}

function clearCellsUI(arrayNodes: NodeListOf<Element>) {
  arrayNodes.forEach((cell) => {
    cell.classList.remove('victory')
    cell.classList.remove('anim')
    cell.innerHTML = ''
  })
}

function statusListener(status: GameStatus) {
  switch (status) {
    case GameStatus.Draw:
      changeDrawUI()
      return

    case GameStatus.Win:
      changeWinUI()
      return

    case GameStatus.Restart: {
      changeRestartUI()
      return
    }
    case GameStatus.Running:
      changeStartUI()
      return

    default:
      return
  }
}

export function initUI() {
  store.listen((value, key) => {
    if (key === 'status') {
      statusListener(value[key])
    }
    if (key === 'currentPlayer') {
      changePlayerUI()
    }
    if (key === 'node') {
      changeCellUI(value[key])
    }
  })
}

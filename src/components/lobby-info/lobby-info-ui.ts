import { Player } from '@domain/stores/game.store'

const lobbyInfoContainer = document.querySelector('.lobby-info')
const lobbyInfoName = document.querySelector('.lobby-info-name')
const lobbyInfoStatus = document.querySelector('.lobby-info-status')
const lobbyInfoPlayer = document.querySelector('.lobby-info-player')
const playerCross = document.querySelector('.player-cross')
const playerCircle = document.querySelector('.player-circle')

const gameContainer = document.querySelector('.game-main')

export function showLobbyInfo(room: string) {
  if (!lobbyInfoContainer) {
    throw new Error('error')
  }
  lobbyInfoContainer.classList.remove('hide')

  if (lobbyInfoName) {
    lobbyInfoName.innerHTML = `Joined into room: <b>${room}</b>`
  }
}

export function hideLobbyInfo() {
  if (!lobbyInfoContainer) {
    throw new Error('error')
  }
  lobbyInfoContainer.classList.add('hide')
}

export function showPlayer(player: Player) {
  if (lobbyInfoPlayer) {
    lobbyInfoPlayer.classList.remove('hide')
    if (player === Player.Cross) {
      if (playerCross) {
        playerCross?.classList.remove('hide')
        playerCircle?.classList.add('hide')
      }
    } else {
      if (playerCircle) {
        playerCircle?.classList.remove('hide')
        playerCross?.classList.add('hide')
      }
    }
  }
}

export function hidePlayer() {
  if (lobbyInfoPlayer) {
    lobbyInfoPlayer.classList.add('hide')
  }
}

export function runTimer() {
  if (!lobbyInfoStatus) {
    throw new Error('error')
  }
  let time = 5

  lobbyInfoStatus.innerHTML = `Game will start in ${time} seconds`
  lobbyInfoStatus?.classList.remove('hide')

  const timer = setInterval(() => {
    time--
    lobbyInfoStatus.innerHTML = `Game will start in ${time} seconds`
    if (time === 0) {
      gameContainer?.classList.remove('hide')
      clearInterval(timer)
      lobbyInfoStatus.innerHTML = 'Game started'
      const game = document.getElementById('game')
      if (game) {
        game.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        })
      }
    }
  }, 1000)
}

export function showPendingMessage() {
  if (lobbyInfoStatus) {
    lobbyInfoStatus.classList.remove('hide')
    lobbyInfoStatus.innerHTML = 'Waiting for another player'
  }
}

export function showGameStartMessage() {
  runTimer()
}

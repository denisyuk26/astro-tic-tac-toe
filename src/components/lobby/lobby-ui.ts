const lobby = document.querySelector('.lobby-main')
const top = document.getElementById('top')
const gameContainer = document.querySelector('.game-main')
const lobbyError = document.querySelector('.lobby-error')

export function hideLobby() {
  if (lobby) {
    lobby.classList.add('hide')
  }
}

export function srollToTopScreen() {
  if (top) {
    top.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    })
  }
  const timeout = setTimeout(() => {
    gameContainer?.classList.add('hide')
  }, 500)

  return () => {
    clearTimeout(timeout)
  }
}

export function showLobbyError(message: string) {
  if (lobbyError) {
    lobbyError.classList.remove('hide')
    lobbyError.innerHTML = message
  }
}

export function hideLobbyError() {
  if (lobbyError) {
    lobbyError.classList.add('hide')
    lobbyError.innerHTML = ''
  }
}

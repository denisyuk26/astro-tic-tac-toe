import { io, Socket } from 'socket.io-client'

class SocketService {
  public socket: Socket | null

  constructor() {
    this.socket = null
  }

  public connect(url: string) {
    return new Promise((resolve, reject) => {
      this.socket = io(url)
      if (!this.socket) {
        return reject()
      }

      this.socket.on('connect', () => {
        resolve(this.socket)
      })
      this.socket.on('connect_error', (error) => {
        reject(error)
      })
    })
  }
}

const socketService = new SocketService()

export default socketService

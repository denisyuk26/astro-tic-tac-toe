import { computed, map } from 'nanostores'
import { Player } from './game.store'

export enum RoomStatus {
  Pending = 'pending',
  Full = 'full',
}

type RoomState = {
  status: RoomStatus
  name: string
  player: Player
}

function createRoomStore() {
  return map<RoomState>(undefined)
}

export const lobbyStore = createRoomStore()

export function updateRoomState(
  status: RoomStatus,
  name: string,
  player: Player,
) {
  lobbyStore.set({
    status,
    name,
    player,
  })
}

export const roomNameState = computed(lobbyStore, (state) => {
  return state.name
})

export const roomStatus = computed(lobbyStore, (state) => {
  return state.status
})

export const roomPlayer = computed(lobbyStore, (state) => {
  return state.player
})

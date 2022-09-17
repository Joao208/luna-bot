import { AudioResource } from '@discordjs/voice'

export interface IMusicQueue {
  queue: { [key: string]: AudioResource[] }
  addSong: (id: string, song: AudioResource) => void
  removeSong: (id: string) => void
  isCurrentPlaying: (id: string) => boolean
  getQueue: (id: string) => AudioResource[]
  clearQueue: (id: string) => void
}

class MusicQueue implements IMusicQueue {
  queue: { [key: string]: AudioResource[] }

  constructor() {
    this.queue = {}
  }

  addSong(serverId: string, song: AudioResource) {
    if (!this.queue[serverId]) this.queue[serverId] = []

    this.queue[serverId].push(song)
  }

  removeSong(serverId: string) {
    if (!this.queue[serverId]) return

    this.queue[serverId].shift()
  }

  isCurrentPlaying(serverId: string) {
    if (!this.queue[serverId]) return false

    return !!this.queue[serverId].length
  }

  getQueue(serverId: string) {
    if (!this.queue[serverId]) return []

    return this.queue[serverId]
  }

  clearQueue(serverId: string) {
    if (!this.queue[serverId]) return

    this.queue[serverId] = []
  }
}

export default new MusicQueue()

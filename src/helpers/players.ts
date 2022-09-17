import { AudioPlayer } from '@discordjs/voice'

export interface IPlayers {
  setPlayer(id: string, player: AudioPlayer): void
  getPlayer(id: string): AudioPlayer | null
  removePlayer(id: string): void
}

class Players implements IPlayers {
  players: { [key: string]: AudioPlayer | null }

  constructor() {
    this.players = {}
  }

  setPlayer(serverId: string, player: AudioPlayer | null) {
    this.players[serverId] = player
  }

  getPlayer(serverId: string) {
    return this.players[serverId]
  }

  removePlayer(serverId: string) {
    delete this.players[serverId]
  }
}

export default new Players()

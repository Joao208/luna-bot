import { ChatInputCommandInteraction } from 'discord.js'
import MusicQueue, { IMusicQueue } from '@src/helpers/musicQueue'
import Players, { IPlayers } from '@src/helpers/players'
import { IInteraction } from '@src/interactions/IInteraction'

export type INextInteraction = IInteraction

class NextInteraction implements INextInteraction {
  constructor(private musicQueue: IMusicQueue, private players: IPlayers) {}

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const serverId = interaction.guildId as string

    if (!this.musicQueue.getQueue(serverId).length) {
      interaction.reply('The queue is empty')

      return
    }

    this.musicQueue.removeSong(serverId)

    const nextSong = this.musicQueue.getQueue(serverId)[0]

    const nextSongMetadata = nextSong.metadata as unknown as { title: string }

    this.players.getPlayer(serverId)?.play(nextSong)

    interaction.reply(`Playing next song ${nextSongMetadata.title}`)

    return
  }
}

export default new NextInteraction(MusicQueue, Players)

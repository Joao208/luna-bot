import MusicQueue, { IMusicQueue } from '@src/helpers/musicQueue'
import Players, { IPlayers } from '@src/helpers/players'
import { Metadata } from '@src/interactionCommands/play.interaction'
import loggerProvider from '@src/providers/loggerProvider'
import { IInteraction } from '@src/types/IInteraction'
import { SelectMenuInteraction } from 'discord.js'

export type IQueueSelectInteraction = IInteraction

class QueueSelectInteraction implements IQueueSelectInteraction {
  constructor(private players: IPlayers, private musicQueue: IMusicQueue) {}

  async execute(interaction: SelectMenuInteraction): Promise<void> {
    const serverId = interaction.guildId as string

    if (!interaction.isRepliable() || interaction.replied) return

    if (!this.players.getPlayer(serverId)) {
      await interaction
        .reply('I am not playing in this server')
        .catch((error) =>
          loggerProvider.log({
            type: 'error',
            message: error.message,
          })
        )

      return
    }

    const selectedOption = interaction.values[0]

    if (!selectedOption) return

    const songIndex = Number(selectedOption) - 1

    const song = this.musicQueue.getQueue(serverId)[songIndex]

    this.players.getPlayer(serverId)?.play(song)

    await interaction
      .reply(`Playing ${(song.metadata as Metadata).title}`)
      .catch((error) =>
        loggerProvider.log({
          type: 'error',
          message: error.message,
        })
      )

    return
  }
}

export default new QueueSelectInteraction(Players, MusicQueue)

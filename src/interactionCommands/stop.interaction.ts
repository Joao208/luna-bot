import { ChatInputCommandInteraction } from 'discord.js'
import Channels, { IChannels } from '@src/helpers/channels'
import MusicQueue, { IMusicQueue } from '@src/helpers/musicQueue'
import Players, { IPlayers } from '@src/helpers/players'
import loggerProvider from '@src/providers/loggerProvider'
import { IInteraction } from '@src/types/IInteraction'

export type IStopInteraction = IInteraction

class StopInteraction implements IStopInteraction {
  constructor(
    private channels: IChannels,
    private musicQueue: IMusicQueue,
    private Players: IPlayers
  ) {}

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.isRepliable() || interaction.replied) return

    if (!this.channels.getChannel(interaction.guildId as string)) {
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

    this.channels.removeChannel(interaction.guildId as string)
    this.musicQueue.clearQueue(interaction.guildId as string)
    this.Players.removePlayer(interaction.guildId as string)

    await interaction
      .reply("Okay... I'm stopped the music. Until later!")
      .catch((error) =>
        loggerProvider.log({
          type: 'error',
          message: error.message,
        })
      )

    return
  }
}

export default new StopInteraction(Channels, MusicQueue, Players)

import { ChatInputCommandInteraction } from 'discord.js'
import Players, { IPlayers } from '@src/helpers/players'
import { IInteraction } from '@src/interactions/IInteraction'
import loggerProvider from '@src/providers/loggerProvider'

export type IPauseInteraction = IInteraction

class PauseInteraction implements IPauseInteraction {
  constructor(private players: IPlayers) {}

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
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

    this.players.getPlayer(serverId)?.pause()

    await interaction.reply('Music paused').catch((error) =>
      loggerProvider.log({
        type: 'error',
        message: error.message,
      })
    )

    return
  }
}

export default new PauseInteraction(Players)

import { IInteraction } from '@src/types/IInteraction'
import { ChatInputCommandInteraction } from 'discord.js'

export type IHelpInteraction = IInteraction

class HelpInteraction implements IHelpInteraction {
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply({
      content: 'Hello World!',
      ephemeral: true,
    })
  }
}

export default new HelpInteraction()

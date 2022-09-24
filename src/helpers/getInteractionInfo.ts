import { Interaction } from 'discord.js'

export class GetInteractionInfo {
  constructor(private interaction: Interaction) {}

  getNameInteraction(): string | null {
    if (this.interaction.isCommand()) {
      return this.interaction.commandName
    }

    if (this.interaction.isSelectMenu()) {
      return this.interaction.customId
    }

    return null
  }

  getTypeInteraction(): string | null {
    if (this.interaction.isCommand()) {
      return 'command'
    }

    if (this.interaction.isSelectMenu()) {
      return 'select'
    }

    return null
  }
}

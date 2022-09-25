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

    if (this.interaction.isButton()) {
      return this.interaction.customId.toString().split('&')[0]
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

    if (this.interaction.isButton()) {
      return 'button'
    }

    return null
  }
}

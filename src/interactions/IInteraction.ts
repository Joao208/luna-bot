import { Interaction } from 'discord.js'

export interface IInteraction {
  execute(interaction: Interaction): Promise<void>
}

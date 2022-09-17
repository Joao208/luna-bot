import { ChatInputCommandInteraction } from 'discord.js'
import Channels, { IChannels } from '@src/helpers/channels'
import MusicQueue, { IMusicQueue } from '@src/helpers/musicQueue'
import Players, { IPlayers } from '@src/helpers/players'
import { IInteraction } from '@src/interactions/IInteraction'

export type IStopInteraction = IInteraction

class StopInteraction implements IStopInteraction {
  constructor(
    private channels: IChannels,
    private musicQueue: IMusicQueue,
    private Players: IPlayers
  ) {}

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    this.channels.removeChannel(interaction.guildId as string)
    this.musicQueue.clearQueue(interaction.guildId as string)
    this.Players.removePlayer(interaction.guildId as string)

    interaction.reply("Okay... I'm stopped the music. Until later!")

    return
  }
}

export default new StopInteraction(Channels, MusicQueue, Players)

import { joinVoiceChannel, VoiceConnection } from '@discordjs/voice'
import { InternalDiscordGatewayAdapterCreator } from 'discord.js'
import { IVoiceConnectionObject } from 'src/interactions/play.interaction'

export interface IChannels {
  channels: { [key: string]: VoiceConnection }
  getChannel: (id: string) => VoiceConnection
  setChannel: (interaction: IVoiceConnectionObject) => Promise<VoiceConnection>
  removeChannel: (id: string) => void
}

class Channels implements IChannels {
  channels: { [key: string]: VoiceConnection }

  constructor() {
    this.channels = {}
  }

  getChannel(serverId: string) {
    return this.channels[serverId]
  }

  async setChannel(interaction: IVoiceConnectionObject) {
    this.channels[interaction.guildId as string] = joinVoiceChannel({
      // @ts-ignore
      channelId: interaction.voiceChannelId,
      guildId: interaction.guildId as string,
      adapterCreator:
        interaction.voiceAdapterCreator as InternalDiscordGatewayAdapterCreator,
    })

    return this.channels[interaction.guildId as string]
  }

  removeChannel(serverId: string) {
    this.channels[serverId].destroy()

    delete this.channels[serverId]
  }
}

export default new Channels()

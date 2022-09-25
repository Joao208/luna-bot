import {
  ButtonInteraction,
  GuildMember,
  InternalDiscordGatewayAdapterCreator,
} from 'discord.js'
import { IInteraction } from '@src/types/IInteraction'
import playInteraction from '@src/interactionCommands/play.interaction'

export type IPlayInteraction = IInteraction

class PlayInteraction implements IPlayInteraction {
  async execute(interaction: ButtonInteraction): Promise<void> {
    const musicId = interaction.customId.split('&')[1]
    const prefix = interaction.customId.split('&')[2]

    const idPrefix = prefix === 'playlist' ? 'list' : 'v'

    const completeMusicUrl = `https://music.youtube.com/${prefix}?${idPrefix}=${musicId}`

    if (!interaction.isRepliable() || interaction.replied) return

    await interaction.reply('🔍 Searching...')

    const member = interaction.member as GuildMember

    await playInteraction.executeWithoutInteraction({
      musicUrl: completeMusicUrl,
      serverId: interaction.guildId as string,
      voiceAdapterCreator: interaction.guild
        ?.voiceAdapterCreator as InternalDiscordGatewayAdapterCreator,
      voiceChannelId: member?.voice.channelId as string,
    })

    await interaction.editReply('🎶 Added to playlist...')

    interaction.guild?.channels.cache
      .filter((channel) => {
        return channel.isThread() && channel.name === 'Play song luna bot'
      })
      .forEach(async (channel) => {
        await channel?.delete()
      })
  }
}

export default new PlayInteraction()

import { getVoiceConnection } from '@discordjs/voice'
import {
  BuildMessageListener,
  RegexObject,
} from '@src/helpers/buildMessageListener'
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'

export default new BuildMessageListener()
  .setName('play')
  .setCallback(async (message, nameRegex, matchValue) => {
    const userChannel = message.member?.voice.channel
    const currentChannel = getVoiceConnection(message.guildId as string)

    const botWithoutChannel = !currentChannel?.joinConfig.channelId
    const botInSameChannel =
      currentChannel?.joinConfig.channelId === userChannel?.id
    const botCanJoin = botWithoutChannel || botInSameChannel

    const isPlaylist = nameRegex === 'playlist'

    if (userChannel && botCanJoin) {
      const prefix = isPlaylist ? 'playlist' : 'watch'

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`play&${matchValue}&${prefix}`)
          .setLabel('Do you want to play this song?')
          .setStyle(ButtonStyle.Primary)
      )

      await message.startThread({
        name: 'Play song luna bot',
        autoArchiveDuration: 60,
        reason: 'Ask if user want to play song',
      })

      await message.thread?.send({
        content: 'I can recognize this song!',
        // @ts-ignore
        components: [row],
      })

      return
    }
  })
  .setRegex([
    new RegexObject({
      name: 'music',
      regex: /(?<=music.youtube.com\/watch\?v=)(.*?)(?=&)/gm,
    }),
    new RegexObject({
      name: 'playlist',
      regex: /(?<=music.youtube.com\/playlist\?list=)(.*?)(?=&| |$)/gm,
    }),
  ])

import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  SelectMenuBuilder,
} from 'discord.js'
import MusicQueue, { IMusicQueue } from '@src/helpers/musicQueue'
import { IInteraction } from '@src/interactions/IInteraction'
import { Metadata } from '@src/interactions/play.interaction'
import loggerProvider from '@src/providers/loggerProvider'

export type IQueueInteraction = IInteraction

class QueueInteraction implements IQueueInteraction {
  constructor(private musicQueue: IMusicQueue) {}

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const serverId = interaction.guildId as string

    const musicQueue = this.musicQueue.getQueue(serverId)

    if (!musicQueue?.length) {
      await interaction
        .reply({
          content: 'There is no music in the queue.',
          ephemeral: true,
        })
        .catch((error) =>
          loggerProvider.log({ message: error.message, type: 'error' })
        )

      return
    }

    const musicQueueLimited = musicQueue.slice(0, 10)

    const queueMessage = musicQueueLimited.map((music, index) => {
      return {
        label: (music.metadata as Metadata).title,
        value: (index + 1).toString(),
      }
    })

    const row = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId('music-queue')
        .setPlaceholder('Nothing selected')
        .addOptions(queueMessage)
    )

    await interaction
      .reply({
        content: 'Your queue, for jump to music, select one option.',
        // @ts-ignore
        components: [row],
      })
      .catch((error) =>
        loggerProvider.log({
          type: 'error',
          message: error.message,
        })
      )
  }
}

export default new QueueInteraction(MusicQueue)

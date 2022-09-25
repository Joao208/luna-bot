import 'dotenv/config'
import { REST } from '@discordjs/rest'
import {
  ActionRowBuilder,
  ActivityType,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  Client,
  CommandInteraction,
  GatewayIntentBits,
  Routes,
  TextChannel,
} from 'discord.js'
import glob from 'glob'
import { bold } from '@discordjs/builders'

import loggerProvider from '@src/providers/loggerProvider'
import { OwnerRepository, ServerRepository } from '@src/repositories'
import { GetInteractionInfo } from '@src/helpers/getInteractionInfo'
import { IInteraction } from '@src/types/IInteraction'
import { StringifyInteraction } from '@src/helpers/stringifyInteraction'
import {
  BuildMessageListener,
  RegexObject,
} from '@src/helpers/buildMessageListener'

class Bot {
  rest: REST
  commands: CommandInteraction[]
  messages: BuildMessageListener['message'][]
  client: Client
  interactions: {
    [key: string]: { [key: string]: IInteraction }
  }

  constructor() {
    this.rest = new REST({ version: '9' }).setToken(
      process.env.DISCORD_TOKEN as string
    )

    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
      ],
    })

    this.commands = []
    this.messages = []
    this.interactions = {
      command: {},
      select: {},
      button: {},
    }

    this.getCommands()
    this.getCommandInteractions()
    this.getSelectInteraction()
    this.getCommandButtons()
    this.getMessages()
  }

  private getSelectInteraction() {
    glob('src/interactionSelects/**/*.interaction.*', (_err, files) => {
      files.forEach((filePath) => {
        const interactionName = filePath.split('/')[2].split('.')[0]

        const interaction = require(`../${filePath}`).default

        if (!this.interactions) this.interactions = {}

        this.interactions['select'][interactionName] =
          interaction as unknown as IInteraction

        loggerProvider.log({
          type: 'info',
          message: `Interaction ${interactionName} loaded.`,
        })
      })
    })
  }

  private getCommandInteractions() {
    glob('src/interactionCommands/**/*.interaction.*', (_err, files) => {
      files.forEach((filePath) => {
        const interactionName = filePath.split('/')[2].split('.')[0]

        const interaction = require(`../${filePath}`).default

        if (!this.interactions) this.interactions = {}

        this.interactions['command'][interactionName] =
          interaction as unknown as IInteraction

        loggerProvider.log({
          type: 'info',
          message: `Interaction ${interactionName} loaded.`,
        })
      })
    })
  }

  private getCommandButtons() {
    glob('src/interactionButtons/**/*.interaction.*', (_err, files) => {
      files.forEach((filePath) => {
        const interactionName = filePath.split('/')[2].split('.')[0]

        const interaction = require(`../${filePath}`).default

        if (!this.interactions) this.interactions = {}

        this.interactions['button'][interactionName] =
          interaction as unknown as IInteraction

        loggerProvider.log({
          type: 'info',
          message: `Button ${interactionName} loaded.`,
        })
      })
    })
  }

  private getCommands() {
    glob('src/commands/**/*.command.*', (_err, files) => {
      files.forEach((filePath) => {
        const command = require(`../${filePath}`).default

        this.commands.push(command as unknown as CommandInteraction)

        loggerProvider.log({
          type: 'info',
          message: `Command ${command.name} loaded.`,
        })
      })

      this.setCommands()
    })
  }

  private getMessages() {
    glob('src/messages/**/*.message.*', (_err, files) => {
      files.forEach((filePath) => {
        const { message } = require(`../${filePath}`).default

        this.messages.push(
          message as unknown as BuildMessageListener['message']
        )

        loggerProvider.log({
          type: 'info',
          message: `Message ${message.name} loaded.`,
        })
      })
    })
  }

  private async setCommands() {
    this.rest
      .put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID as string),
        {
          body: this.commands,
        }
      )
      .then(() => {
        this.setListeners()

        loggerProvider.log({
          type: 'info',
          message: 'Successfully registered application commands.',
        })
      })
  }

  private setListeners() {
    this.client.on('error', (error) => {
      loggerProvider.log({
        type: 'error',
        message: `Error in client ${error}`,
      })
    })

    this.client.on('messageCreate', async (message) => {
      const content = message.content.toString()

      this.messages.forEach((messageListener) => {
        const found = messageListener.regex.find((regex) => {
          if (regex instanceof RegExp) {
            return !!regex.exec(content)?.[0]
          }

          if (regex instanceof RegexObject) {
            return !!regex.regex.exec(content)?.[0]
          }

          return false
        }) as unknown as RegexObject | RegExp

        if (found instanceof RegExp) {
          found.exec(content)

          const match = found.exec(content)?.[0]

          if (match) {
            messageListener.callback(message, found.source, match)
          }
        }

        if (found instanceof RegexObject) {
          found.regex.exec(content)

          const match = found.regex.exec(content)?.[0]

          if (match) {
            messageListener.callback(message, found.name, match)
          }
        }
      })
    })

    this.client.on('guildCreate', async (guild) => {
      loggerProvider.log({
        type: 'info',
        message: `Joined guild ${guild.name}`,
      })

      const channel = guild.channels.cache.find((channel) => {
        return channel.type === ChannelType.GuildText
      }) as TextChannel

      const owner = await this.client.users.fetch(guild.ownerId)

      let messageToChannel = ''

      messageToChannel += 'Hello, i’m the Luna Bot!\n\n'

      messageToChannel +=
        'I’ll be here for help and become the experience you more pleasurable. If you want to know what commands I have, send /help\n\n'

      messageToChannel += 'It was nice to meet you!\n\n'

      let messageToOwner = ''

      messageToOwner += `Hello ${owner.username}!\n\n`

      messageToOwner += `You added me for the ${
        guild.name
      } channel. To manage my functions in the server, access our ${bold(
        'dashboard'
      )}.\n\n`

      messageToOwner +=
        'If you have doubts about my commands, send /help in this chat or in your server.\n\n'

      messageToOwner += 'As I said on the server, it was nice to meet you!\n\n'

      const sendMessageToChannelPromise = channel?.send(messageToChannel)
      const sendMessageToOwnerPromise = owner?.send(messageToOwner)

      const createServerPromisePromise = new ServerRepository().create({
        GuildId: guild.id,
        OwnerId: owner.id,
      })

      const createOwnerPromise = new OwnerRepository().create({
        DiscordId: guild.ownerId,
        username: owner.username,
      })

      await Promise.all([
        sendMessageToChannelPromise,
        sendMessageToOwnerPromise,
        createServerPromisePromise,
        createOwnerPromise,
      ])
    })

    this.client.on('interactionCreate', async (interaction) => {
      try {
        loggerProvider.log({
          ...interaction,
          message: 'Interaction received.',
          type: 'info',
        })

        const getNameInteraction = new GetInteractionInfo(interaction)

        const name = getNameInteraction.getNameInteraction()
        const type = getNameInteraction.getTypeInteraction()

        if (!name || !type) {
          await interaction.channel?.send({ content: 'Invalid interaction' })

          return
        }

        const currentInteraction = this.interactions[type][name]

        if (!currentInteraction) return

        await currentInteraction.execute(interaction)
      } catch (error) {
        const errorMessage = `Error in interaction ${
          interaction.id
        } with message: ${(error as Error).message}`

        loggerProvider.log({
          message: errorMessage,
          type: 'error',
        })

        const urlToReport = `https://github.com/luna-bot-br/luna-bot/issues/new?title=${errorMessage}`

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel('Report the bug!')
            .setURL(encodeURI(urlToReport))
            .setStyle(ButtonStyle.Link)
        )

        const errorMessageBody = {
          content: 'Something went wrong. Report to the developers.',
          components: [row],
          ephemeral: true,
        }

        if (interaction.isRepliable() && !interaction.replied) {
          // @ts-ignore
          await interaction.reply(errorMessageBody)
        } else if (interaction.isRepliable() && interaction.replied) {
          // @ts-ignore
          await interaction.editReply(errorMessageBody)
        }
      }
    })

    this.client.login(process.env.DISCORD_TOKEN as string).then(() => {
      return this.client.user?.setPresence({
        activities: [{ name: 'Help?', type: ActivityType.Playing }],
        status: 'online',
      })
    })
  }
}

export default new Bot()

import 'dotenv/config'
import { REST } from '@discordjs/rest'
import {
  ActivityType,
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

class Bot {
  rest: REST
  commands: CommandInteraction[]
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
    this.interactions = {
      command: {},
      select: {},
    }

    this.getCommands()
    this.getCommandInteractions()
    this.getSelectInteraction()
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
        const getNameInteraction = new GetInteractionInfo(interaction)

        const name = getNameInteraction.getNameInteraction()
        const type = getNameInteraction.getTypeInteraction()

        if (!name || !type) {
          interaction.channel?.send({ content: 'Invalid interaction' })

          return
        }

        const currentInteraction = this.interactions[type][name]

        if (!currentInteraction) return

        await currentInteraction.execute(interaction)
      } catch (error) {
        if (error instanceof Error) {
          loggerProvider.log({
            message: error.message,
            type: 'error',
          })
        }

        if (interaction.isRepliable() && !interaction.replied) {
          interaction.reply({
            content: 'Something went wrong.',
            ephemeral: true,
          })
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

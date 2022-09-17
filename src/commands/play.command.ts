import { SlashCommandBuilder } from 'discord.js'

export default new SlashCommandBuilder()
  .setName('play')
  .setDescription('Play one music')
  .addStringOption((option) =>
    option
      .setName('music')
      .setDescription('The url of the music, playlist or term to search')
      .setRequired(true)
  )

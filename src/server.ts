import bot from '@src/bot'
import loggerProvider from '@src/providers/loggerProvider'
import app from '@src/app'

const server = app.getServer()

bot.client.on('ready', () => {
  loggerProvider.log({
    type: 'info',
    message: 'Bot is ready.',
  })

  server.listen(3000, () => {
    loggerProvider.log({
      type: 'info',
      message: 'Server is running on port 3000',
    })
  })
})

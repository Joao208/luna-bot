import '@src/bot'
import loggerProvider from '@src/providers/loggerProvider'
import app from '@src/app'

const server = app.getServer()

server.listen(3000, () => {
  loggerProvider.log({
    type: 'info',
    message: 'Server is running on port 3000',
  })
})

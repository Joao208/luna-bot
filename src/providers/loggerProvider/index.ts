import Coralogix from 'coralogix-logger'
import {
  ILoggerProvider,
  ILogProps,
} from '@src/providers/loggerProvider/ILoggerProvider'

class LoggerProvider implements ILoggerProvider {
  private logger: Console
  private loggerCoralogix: Coralogix.CoralogixLogger

  constructor() {
    this.logger = console

    const config = new Coralogix.LoggerConfig({
      applicationName: 'luna-bot',
      privateKey: process.env.CORALOGIX_KEY,
      subsystemName: process.env.NODE_ENV ?? 'development',
    })

    Coralogix.CoralogixLogger.configure(config)

    this.loggerCoralogix = new Coralogix.CoralogixLogger('LoggerProvider')
  }

  log({ type, message }: ILogProps) {
    const log = new Coralogix.Log({
      severity: Coralogix.Severity.info,
      text: message,
    })

    this.loggerCoralogix.addLog(log)

    this.logger[type](message)
  }
}

export default new LoggerProvider()

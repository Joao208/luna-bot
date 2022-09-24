import {
  ILoggerProvider,
  ILogProps,
} from '@src/providers/loggerProvider/ILoggerProvider'

class LoggerProvider implements ILoggerProvider {
  private logger: Console

  constructor() {
    this.logger = console
  }

  log({ type, message }: ILogProps) {
    this.logger[type](message)
  }
}

export default new LoggerProvider()

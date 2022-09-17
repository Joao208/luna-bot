export interface ILogProps {
  type: 'log' | 'info' | 'warn' | 'error'
  message: string | Error | unknown
}

export interface ILoggerProvider {
  log(props: ILogProps): void
}

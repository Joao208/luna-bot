export interface ILogProps {
  type: 'log' | 'info' | 'warn' | 'error'
  message: string
}

export interface ILoggerProvider {
  log(props: ILogProps): void
}

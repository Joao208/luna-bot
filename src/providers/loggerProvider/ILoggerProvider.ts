export interface ILogProps {
  type: 'log' | 'info' | 'warn' | 'error'
  message: string
  [key: string]: unknown
}

export interface ILoggerProvider {
  log(props: ILogProps): void
}

export interface ILogProps {
  type: 'log' | 'info' | 'warn' | 'error'
  message: string | Error | unknown | never
}

export interface ILoggerProvider {
  log(props: ILogProps): void
}

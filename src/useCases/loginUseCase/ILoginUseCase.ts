export interface ILoginUseCase {
  handle(code: string): Promise<string>
}

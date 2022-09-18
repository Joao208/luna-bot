export interface ILoginUseCase {
  handle(code: string): Promise<{ token: string; refreshToken: string }>
}

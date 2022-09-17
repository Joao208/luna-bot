import { IFetchClientProvider } from '@src/providers/fetchClientProvider/IFetchClientProvider'
import { ILoginUseCase } from '@src/useCases/loginUseCase/ILoginUseCase'

interface CreateTokenResponse {
  access_token: string
  token_type: string
}

interface GetUserInfoResponse {
  id: string
  username: string
  avatar: string
  avatar_decoration: string
  discriminator: string
  public_flags: string
  flags: string
  banner: string
  banner_color: string
  accent_color: string
  locale: string
  mfa_enabled: string
}

export class LoginUseCase implements ILoginUseCase {
  constructor(private fetchClientProvider: IFetchClientProvider) {}

  async handle(code: string) {
    if (!code) return 'Missing code'

    this.fetchClientProvider.create('https://discord.com/api')

    const body = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID as string,
      client_secret: process.env.DISCORD_CLIENT_SECRET as string,
      redirect_uri: process.env.APP_URL as string,
      code,
      grant_type: 'authorization_code',
      scope: 'identify',
    }).toString()

    const getTokensPromise = await this.fetchClientProvider.post({
      url: '/oauth2/token',
      body,
      config: {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    })

    const { access_token, token_type } =
      getTokensPromise as unknown as CreateTokenResponse

    const response = await this.fetchClientProvider.get({
      url: '/users/@me',
      config: {
        headers: {
          authorization: `${token_type} ${access_token}`,
        },
      },
    })

    const { username } = response as unknown as GetUserInfoResponse

    return `Seja bem vindo ${username}`
  }
}

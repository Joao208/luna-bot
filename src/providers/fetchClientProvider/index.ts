import { Axios, AxiosRequestConfig } from 'axios'
import { IFetchClientProvider } from '@src/providers/fetchClientProvider/IFetchClientProvider'

export class FetchClientProvider implements IFetchClientProvider {
  client: Axios | undefined
  baseURL: string | undefined

  create(baseURL: string) {
    this.client = new Axios({
      baseURL,
    })

    this.baseURL = baseURL
  }

  async post({
    url,
    body,
    config,
  }: {
    url: string
    body: unknown
    config: AxiosRequestConfig
  }) {
    if (!this.client) throw new Error('Client not initialized')

    const response = await this.client?.post(this.baseURL + url, body, config)

    return JSON.parse(response?.data)
  }

  async get({ url, config }: { url: string; config: AxiosRequestConfig }) {
    if (!this.client) throw new Error('Client not initialized')

    const response = await this.client?.get(this.baseURL + url, config)

    return JSON.parse(response?.data)
  }
}

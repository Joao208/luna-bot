import { AxiosRequestConfig } from 'axios'

export interface IFetchClientProvider {
  create(baseURL: string): void
  post({
    url,
    body,
    config,
  }: {
    url: string
    body: unknown
    config?: AxiosRequestConfig
  }): Promise<unknown>
  get({
    url,
    config,
  }: {
    url: string
    config?: AxiosRequestConfig
  }): Promise<unknown>
}

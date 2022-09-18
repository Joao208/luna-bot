import { JwtPayload } from 'jsonwebtoken'

export interface IEncryptionProvider {
  encrypt(
    data: object,
    key?: string | null,
    config?: { [key: string]: unknown }
  ): string
  decrypt(
    data: string,
    key?: string | null,
    config?: { [key: string]: unknown }
  ): JwtPayload
}

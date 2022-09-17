import { JwtPayload } from 'jsonwebtoken'

export interface IEncryptionProvider {
  encrypt(data: object): string
  decrypt(data: string): JwtPayload
}

import jwt, { JwtPayload } from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { IEncryptionProvider } from '@src/providers/encryptionProvider/IEncryptionProvider'

export class EncryptionProvider implements IEncryptionProvider {
  encrypt(
    data: object,
    key = 'private.key',
    config: { [key: string]: unknown }
  ): string {
    const encryptionKey = fs.readFileSync(
      path.join(__dirname, '..', '..', 'jwt', key || 'private.key')
    )

    return jwt.sign(data, encryptionKey, { algorithm: 'RS256', ...config })
  }

  decrypt(token: string, key = 'public.pem'): JwtPayload {
    const decryptionKey = fs.readFileSync(
      path.join(__dirname, '..', '..', 'jwt', key || 'public.pem')
    )

    return jwt.verify(token, decryptionKey) as JwtPayload
  }
}

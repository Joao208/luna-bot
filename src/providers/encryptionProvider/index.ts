import jwt, { JwtPayload } from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { IEncryptionProvider } from '@src/providers/encryptionProvider/IEncryptionProvider'

export class EncryptionProvider implements IEncryptionProvider {
  encrypt(data: object): string {
    const encryptionToken = fs.readFileSync(
      path.join(__dirname, 'jwt', 'private.key')
    )

    return jwt.sign(data, encryptionToken)
  }

  decrypt(data: string): JwtPayload {
    const decryptionToken = fs.readFileSync(
      path.join(__dirname, 'jwt', 'public.pem')
    )

    return jwt.verify(data, decryptionToken) as JwtPayload
  }
}

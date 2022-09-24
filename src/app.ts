import 'dd-trace/init'
import express, { Application } from 'express'
import cors from 'cors'
import cookieparser from 'cookie-parser'
import { Routes } from '@src/routes'
import { RequestAuth, RequestBody, RequestLogger } from '@src/middlewares'
import { EncryptionProvider } from '@src/providers'
import { ServerRepository } from '@src/repositories'

class App {
  app: Application

  constructor() {
    this.app = express()
    this.loadMiddleware()
    this.loadPublicRoutes()
    this.loadAuthMiddleware()
    this.loadPrivateRoutes()
  }

  private loadMiddleware() {
    this.app.use(express.json())
    this.app.use(cors({ origin: '*' }))
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cookieparser())
    this.app.use(new RequestLogger().handle)
  }

  private loadAuthMiddleware() {
    this.app.use((req, res, next) => {
      return new RequestAuth(
        new EncryptionProvider(),
        new ServerRepository()
      ).handle(req, res, next)
    })
  }

  private loadPublicRoutes() {
    new Routes(this.app, new RequestBody()).public()
  }

  private loadPrivateRoutes() {
    new Routes(this.app, new RequestBody()).private()
  }

  getServer() {
    return this.app
  }
}

export default new App()

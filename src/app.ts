import express, { Application } from 'express'
import cors from 'cors'
import { Routes } from '@src/routes'
import { RequestBody, RequestLogger } from '@src/middlewares'

class App {
  app: Application

  constructor() {
    this.app = express()
    this.loadMiddleware()
    this.loadRoutes()
  }

  private loadMiddleware() {
    this.app.use(express.json())
    this.app.use(cors({ origin: '*' }))
    this.app.use(express.urlencoded({ extended: true }))
    // this.app.use(new RequestAuth(new EncryptionProvider()).handle)
    this.app.use(new RequestLogger().handle)
  }

  private loadRoutes() {
    new Routes(this.app, new RequestBody())
  }

  getServer() {
    return this.app
  }
}

export default new App()

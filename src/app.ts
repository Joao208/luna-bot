import express, { Application } from 'express'
import { Routes } from '@src/routes'

class App {
  app: Application

  constructor() {
    this.app = express()
    this.loadRoutes()
  }

  private loadRoutes() {
    new Routes(this.app)
  }

  getServer() {
    return this.app
  }
}

export default new App()

import { Message } from 'discord.js'

export class RegexObject {
  name: string
  regex: RegExp

  constructor({ name, regex }: { name: string; regex: RegExp }) {
    this.name = name
    this.regex = regex
  }
}

export class BuildMessageListener {
  readonly message: {
    regex: (RegExp | RegexObject)[]
    callback: (message: Message, nameRegex: string, matchValue: string) => void
    name: string
  }

  constructor() {
    this.message = {
      regex: [],
    } as unknown as {
      regex: (RegExp | RegexObject)[]
      callback: (
        message: Message,
        nameRegex: string,
        matchValue: string
      ) => void
      name: string
    }
  }

  setRegex(regex: RegExp | RegexObject[] | RegExp[]) {
    if (regex instanceof RegExp) {
      this.message.regex.push(regex)

      return this
    }

    if (Array.isArray(regex)) {
      this.message.regex = [...this.message.regex, ...regex]

      return this
    }

    return this
  }

  setName(name: string) {
    this.message.name = name

    return this
  }

  setCallback(
    callback: (message: Message, nameRegex: string, matchValue: string) => void
  ) {
    this.message.callback = callback

    return this
  }
}

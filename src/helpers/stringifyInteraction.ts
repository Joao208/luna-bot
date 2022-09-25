export class StringifyInteraction {
  constructor(
    private interaction: {
      [key: string]: string | number | bigint | object | boolean
    }
  ) {}

  stringify(): string {
    Object.entries(this.interaction).forEach(([key, value]) => {
      if (typeof value === 'bigint') {
        this.interaction[key] = value.toString()

        return
      }

      this.interaction[key] = value
    })

    return JSON.stringify(this.interaction, null, 2)
  }
}

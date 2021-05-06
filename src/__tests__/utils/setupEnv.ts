import Environment from 'jest-environment-jsdom'

export default class CustomTestEnvironment extends Environment {
  async setup() {
    await super.setup()
    if (typeof this.global.TextEncoder === 'undefined') {
      const { TextEncoder } = require('util')
      this.global.TextEncoder = TextEncoder
    }
  }
}

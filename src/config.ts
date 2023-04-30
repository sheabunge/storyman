import * as fs from 'fs/promises'

const parseJson = <T>(data: string, allowedProperties: Array<keyof T | string>): Partial<T> =>
  Object.fromEntries(
    Object.entries(JSON.parse(data)).filter(([prop]) => prop in allowedProperties)
  ) as Partial<T>

export default class UserConfig<T extends { [P in keyof T]: unknown }> {
  private readonly configFile: string

  private readonly defaults: T

  private stored: Partial<T> | undefined

  private local: Partial<T>

  constructor(configFile: string, defaultValues: T) {
    this.configFile = configFile
    this.defaults = defaultValues
    this.stored = undefined
    this.local = {}
  }

  private read = (): Promise<Partial<T>> =>
    this.stored ? Promise.resolve(this.stored) :
      fs.readFile(this.configFile)
        .then(content => {
          this.stored = parseJson(content.toString(), Object.keys(this.defaults))
          return this.stored
        })
        .catch(() => {
          this.stored = this.defaults
          return this.stored
        })

  getAll = () =>
    this.read().then(stored =>
      Object.fromEntries(
        (Object.keys(this.defaults) as Array<keyof T>).map(prop =>
          [prop, this.local[prop] ?? stored[prop] ?? this.defaults[prop]]
        )
      )
    )

  get = <K extends keyof T>(prop: K): Promise<T[K]> =>
    this.read().then(stored =>
      this.local[prop] ?? stored[prop] ?? this.defaults[prop]
    )

  set = <K extends keyof T>(prop: K, value: T[K]) => {
    this.local[prop] = value
  }

  unset = (prop: keyof T): Promise<void> =>
    this.read().then(stored => {
      delete stored[prop]
      delete this.local[prop]
    })

  isValid = (prop: PropertyKey): prop is keyof T =>
    prop in this.defaults

  write = (): Promise<void> =>
    this.read().then(stored => {
      this.stored = { ...stored, ...this.local }
      this.local = {}
      return fs.writeFile(this.configFile, JSON.stringify(this.stored))
    })
}

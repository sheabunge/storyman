import { readFile, writeFile } from 'fs/promises'

const FALSY_STRINGS = new Set(['0', 'false', 'no'])

const parseJson = <T>(data: string, allowedProperties: Set<keyof T | string>): Partial<T> =>
  (Object.fromEntries(Object
    .entries(JSON.parse(data))
    .filter(([prop]) => allowedProperties.has(prop))) as Partial<T>)

const parseBoolean = (value: unknown): boolean =>
  Boolean(value) && !('string' === typeof value && FALSY_STRINGS.has(value.toLowerCase()))

export default class UserConfig<T extends { [P in keyof T]: unknown }> {
  public readonly configFile: string

  public readonly defaults: T

  public readonly validProps: Set<keyof T | string>

  private stored: Partial<T> | undefined

  private dirty: Partial<T>

  constructor(configFile: string, defaultValues: T) {
    this.configFile = configFile
    this.defaults = defaultValues
    this.validProps = new Set(Object.keys(defaultValues))
    this.dirty = {}
  }

  private read = (): Promise<Partial<T>> =>
    this.stored
      ? Promise.resolve(this.stored)
      : readFile(this.configFile)
        .then(content =>
          parseJson<T>(content.toString(), this.validProps))
        .catch(() => this.defaults)
        .then(stored => {
          this.stored = stored
          return stored
        })

  getAll = () =>
    this.read().then(stored =>
      Object.fromEntries((Object.keys(this.defaults) as Array<keyof T>)
        .map(prop => [prop, this.dirty[prop] ?? stored[prop] ?? this.defaults[prop]])))

  get = <K extends keyof T>(prop: K): Promise<T[K]> =>
    this.read().then(stored =>
      this.dirty[prop] ?? stored[prop] ?? this.defaults[prop])

  private parseValue = <K extends keyof T>(prop: K, value: T[K]): T[K] => {
    switch (typeof this.defaults[prop]) {
      case 'boolean':
        return parseBoolean(value) as T[K]
      case 'number':
        return Number(value) as T[K]
      default:
        return value
    }
  }

  set = <K extends keyof T>(prop: K, value: T[K]): T[K] => {
    const actualValue = this.parseValue(prop, value)
    this.dirty[prop] = actualValue
    return actualValue
  }

  unset = (prop: keyof T): Promise<void> =>
    this.read().then(stored => {
      delete stored[prop]
      delete this.dirty[prop]
    })

  isValid = (prop: keyof T | string): prop is keyof T =>
    this.validProps.has(prop)

  write = (): Promise<void> =>
    this.read().then(stored => {
      this.stored = { ...stored, ...this.dirty }
      this.dirty = {}
      return writeFile(this.configFile, JSON.stringify(this.stored, undefined, 2))
    })
}

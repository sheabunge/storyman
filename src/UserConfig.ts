import { readFile, writeFile } from 'fs/promises'
import type { UserConfigSpecs } from './types/UserConfigSpecs'

const parseJson = <T>(data: string, allowedProperties: Set<keyof T | string>): Partial<T> =>
  (Object.fromEntries(Object
    .entries(JSON.parse(data))
    .filter(([prop]) => allowedProperties.has(prop))) as Partial<T>)

export default class UserConfig<T extends { [P in keyof T]: unknown }> {
  public readonly configFile: string

  public readonly specs: UserConfigSpecs<T>

  public readonly validProps: Set<keyof T | string>

  private stored: Partial<T> | undefined

  private dirty: Partial<T>

  constructor(specs: UserConfigSpecs<T>, configFile: string) {
    this.configFile = configFile
    this.specs = specs
    this.validProps = new Set(Object.keys(specs))
    this.dirty = {}
  }

  private buildInitialProps = (): T => {
    const defaults: Partial<T> = {}

    for (const prop in this.specs) {
      // eslint-disable-next-line n/no-unsupported-features/es-builtins, prefer-object-has-own
      if (Object.hasOwn ? Object.hasOwn(this.specs, prop) : Object.prototype.hasOwnProperty.call(this.specs, prop)) {
        defaults[prop] = this.specs[prop].defaultValue
      }
    }

    return defaults as T
  }

  private read = (): Promise<Partial<T>> =>
    this.stored
      ? Promise.resolve(this.stored)
      : readFile(this.configFile)
        .then(content =>
          parseJson<T>(content.toString(), this.validProps))
        .catch(this.buildInitialProps)
        .then(stored => {
          this.stored = stored
          return stored
        })

  getAll = () =>
    this.read().then(stored =>
      Object.fromEntries((Object.keys(this.specs) as Array<keyof T>)
        .map(prop => [prop, this.dirty[prop] ?? stored[prop] ?? this.specs[prop].defaultValue])))

  get = <K extends keyof T>(prop: K): Promise<T[K]> =>
    this.read().then(stored =>
      this.dirty[prop] ?? stored[prop] ?? this.specs[prop].defaultValue)

  promptFor = async <K extends keyof T>(prop: K): Promise<T[K]> => {
    const currentValue = await this.get(prop)

    if (currentValue !== undefined) {
      return currentValue
    }

    const spec = this.specs[prop]

    if (spec.prompt === undefined) {
      throw new Error(`Cannot find prompt for ${prop.toString()}`)
    }

    const newValue = this.set(prop, await spec.prompt())
    await this.write()
    return newValue
  }

  set = <K extends keyof T>(prop: K, value: string): T[K] => {
    const actualValue = this.specs[prop].parse(value)
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

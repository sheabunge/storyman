export interface UserConfigProp<T> {
  defaultValue: T
  prompt?: () => Promise<string>
  parse?: (value: string) => T
}

export type UserConfigSpecs<T extends object> = {
  [K in keyof T]: UserConfigProp<T[K]>
}

import { run as start } from '@oclif/core'
import * as Interfaces from '@oclif/core/lib/interfaces'

export const run = (argv?: string[], options?: Interfaces.LoadOptions): Promise<unknown> => {
  console.log('argv', argv)
  return start(argv, options)
}

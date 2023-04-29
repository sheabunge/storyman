import * as path from 'path'
import * as os from 'os'

export const expandPath = (filename: string) =>
  path.resolve(filename.replace(/^~/, os.homedir()))

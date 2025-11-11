import { exec as legacyExec } from 'child_process'
import { promisify } from 'util'

const exec = promisify(legacyExec)

export const getCurrentBranch = async (): Promise<string> =>
  (await exec('git branch --show-current')).stdout.toString().trim()

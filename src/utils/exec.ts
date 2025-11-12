import { exec as callbackExec } from 'child_process'
import { promisify } from 'util'

export const exec = promisify(callbackExec)

export const getCurrentBranch = async (): Promise<string> =>
  (await exec('git branch --show-current')).stdout.toString().trim()

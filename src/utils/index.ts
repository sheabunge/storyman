import { exec as callbackExec } from 'child_process'
import { promisify } from 'util'

export * from './paths'
export * from './story'

export const exec = promisify(callbackExec)

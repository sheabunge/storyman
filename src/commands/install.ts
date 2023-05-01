import { Flags } from '@oclif/core'
import { symlink, access, unlink } from 'fs/promises'
import { dirname, resolve } from 'path'
import { BaseCommand } from '../base'

const HOOK_FILE = '.git/hooks/prepare-commit-msg'

export default class Install extends BaseCommand<typeof Install> {
  static description = 'Install the git `prepare-commit-msg` hook.'

  static examples = [
    '$ story install'
  ]

  static flags = {
    force: Flags.boolean({
      char: 'f',
      description: 'override an existing prepare-commit-msg hook'
    })
  }

  async run() {
    const { flags } = await this.parse(Install)

    await access(dirname(HOOK_FILE)).catch(() =>
      this.error('Current directory does not appear to be a Git repository.')
    )

    const target = resolve('./scripts/prepare-commit-msg')

    return symlink(target, HOOK_FILE)
      .catch(() => {
        if (flags.force) {
          this.log('A prepare-commit-msg hook appears to already exist. Removing due to --force flag.')
          return unlink(HOOK_FILE).then(() => symlink(target, HOOK_FILE))
        }
        this.error('A prepare-commit-msg hook appears to already exist. Please remove it before running this command, or use the --force flag.')
      })
      .then(() => {
        this.debug(`Created symlink '${HOOK_FILE}' -> '${target}'`)
        this.log(`Created prepare-commit-msg hook for ${process.cwd()}.`)
      })
  }
}

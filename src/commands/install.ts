import { BaseCommand } from '../base'
import * as fs from 'fs/promises'
import * as path from 'path'
import { Flags } from '@oclif/core'

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
    const hookFile = '.git/hooks/prepare-commit-msg'

    await fs.access(path.dirname(hookFile)).catch(() =>
      this.error('Current directory does not appear to be a Git repository.')
    )

    if (!flags.force) {
      await fs.access(hookFile).then(() =>
        this.error('A prepare-commit-msg hook appears to already exist. Please remove it before running this command, or use the --force flag.')
      )
    }

    return fs.symlink(hookFile, path.resolve('./scripts/'))
  }
}

import { Flags } from '@oclif/core'
import { access, writeFile, chmod } from 'fs/promises'
import { EOL } from 'os'
import { resolve } from 'path'
import { InstallCommand } from '../installCommand'

const SH_HOOK = [
  '#!/bin/sh',
  'story prepare-commit-msg "$@"',
  ''
].join(EOL)

export default class Install extends InstallCommand<typeof Install> {
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

  static args = {
    ...InstallCommand.baseArgs
  }

  async run() {
    const { flags, args: { repo } } = await this.parse(Install)
    const hookFile = await this.getHookFile(repo)

    if (await this.isForeignHookFile(hookFile)) {
      if (flags.force) {
        this.log('A prepare-commit-msg hook appears to already exist. Overriding due to --force flag.')
      } else {
        this.error('A prepare-commit-msg hook appears to already exist. Please remove it before running this command, or use the --force flag.')
      }
    }

    await writeFile(hookFile, SH_HOOK)
      .then(() => chmod(hookFile, 0o755))
      .then(() => this.log(`Created prepare-commit-msg hook for ${resolve(repo)}.`))
  }
}

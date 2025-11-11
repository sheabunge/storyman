import { Flags } from '@oclif/core'
import { chmod, writeFile } from 'fs/promises'
import { EOL } from 'os'
import { resolve } from 'path'
import { BaseInstallCommand } from '../BaseInstallCommand'

const SH_HOOK = [
  '#!/bin/sh',
  'story prepare-commit-msg "$@"',
  ''
].join(EOL)

export default class Install extends BaseInstallCommand<typeof Install> {
  static summary = 'Install the git prepare-commit-msg hook.'

  static description = 'Install the git `prepare-commit-msg` hook.'

  static examples = [
    `$ story install
Created prepare-commit-msg hook for /home/shea/projects/some-project.
`,
    `$ story install ~/projects/another-project
Created prepare-commit-msg hook for /home/shea/projects/another-project.
`
  ]

  static flags = {
    force: Flags.boolean({
      char: 'f',
      description: 'override an existing prepare-commit-msg hook'
    })
  }

  static args = {
    ...BaseInstallCommand.baseArgs
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

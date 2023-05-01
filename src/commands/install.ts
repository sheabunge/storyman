import { Args, Flags } from '@oclif/core'
import { access, writeFile, chmod, stat } from 'fs/promises'
import { dirname, join } from 'path'
import { BaseCommand } from '../base'

const HOOK_FILE = '.git/hooks/prepare-commit-msg'

const SH_HOOK = [
  '#!/bin/sh',
  'story prepare-commit-msg',
  ''
].join('\n')

export default class Install extends BaseCommand<typeof Install> {
  static description = 'Install the git `prepare-commit-msg` hook.'

  static examples = [
    '$ story install'
  ]

  static args = {
    repo: Args.directory({
      description: 'Path to Git repository. Defaults to current directory.',
      required: false,
      default: process.cwd(),
      exists: true
    })
  }

  static flags = {
    force: Flags.boolean({
      char: 'f',
      description: 'override an existing prepare-commit-msg hook'
    })
  }

  async run() {
    const { flags, args: { repo } } = await this.parse(Install)

    const hookFile = join(repo, HOOK_FILE)

    await access(dirname(hookFile)).catch(() =>
      this.error('Current directory does not appear to be a Git repository.')
    )

    if (await access(hookFile).then(() => true).catch(() => false)) {
      if (flags.force) {
        this.log('A prepare-commit-msg hook appears to already exist. Overriding due to --force flag.')
      } else {
        this.error('A prepare-commit-msg hook appears to already exist. Please remove it before running this command, or use the --force flag.')
      }
    }

    await writeFile(hookFile, SH_HOOK)
      .then(() => chmod(hookFile, 0o755))
      .then(() => this.log(`Created prepare-commit-msg hook for ${repo}.`))
  }
}

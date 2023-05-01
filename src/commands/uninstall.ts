import { rm } from 'fs/promises'
import { resolve } from 'path'
import { InstallCommand } from '../install-command'

export default class Uninstall extends InstallCommand<typeof Uninstall> {
  static description = 'Uninstall the git `prepare-commit-msg` hook.'

  static examples = [
    '$ story uninstall'
  ]

  static args = {
    ...InstallCommand.baseArgs
  }

  async run() {
    const { args: { repo } } = await this.parse(Uninstall)
    const hookFile = await this.getHookFile(repo)

    if (await this.isForeignHookFile(hookFile)) {
      this.error('Existing prepare-commit-msg does not appear to be created by storyman.')
    }

    await rm(hookFile)
      .then(() =>
        this.log(`Removed prepare-commit-msg hook from ${resolve(repo)}.`))
      .catch(() =>
        this.error('Cannot find a prepare-commit-msg hook to remove.'))
  }
}

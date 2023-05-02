import { rm } from 'fs/promises'
import { resolve } from 'path'
import { BaseInstallCommand } from '../base-install'

export default class Uninstall extends BaseInstallCommand<typeof Uninstall> {
  static summary = 'Uninstall the git prepare-commit-msg hook.'
  static description = 'Uninstall the git `prepare-commit-msg` hook.'

  static examples = [
    `$ story uninstall
Removed prepare-commit-msg hook from /home/shea/projects/some-project.
`,
    `$ story uninstall ~/projects/another-project
Removed prepare-commit-msg hook from /home/shea/projects/another-project.
`
  ]

  static args = {
    ...BaseInstallCommand.baseArgs
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

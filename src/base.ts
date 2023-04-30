import { Command, Interfaces } from '@oclif/core'
import { homedir } from 'os'
import * as path from 'path'
import * as fs from 'fs/promises'
import UserConfig from './config'
import { expandPath } from './utils'
import { UserConfigProps } from './types/UserConfigProps'
import { Story } from './types/Story'

export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>
export type Flags<T extends typeof Command> = Interfaces.InferredFlags<T['flags']>

export abstract class BaseCommand<T extends typeof Command> extends Command {
  protected args!: Args<T>
  protected flags!: Flags<T>

  private readonly userConfigFile: string = path.join(homedir(), '.storyman.json')

  protected static userConfigDefaults: UserConfigProps = {
    jiraUrl: '',
    storyFile: '~/.story',
    defaultAuthor: '',
    defaultProject: '',
    requireStory: true,
    requireAuthor: false
  }

  protected readonly userConfig = new UserConfig(this.userConfigFile, BaseCommand.userConfigDefaults)

  getStoryFile = () =>
    this.userConfig.get('storyFile').then(expandPath)

  getStory = (): Promise<Story> =>
    this.getStoryFile().then(storyFile =>
      fs.readFile(storyFile, 'utf8')
        .then(contents => {
          const [parent, child] = contents.trim().split(/\s+/)
          return <Story> { parent, child }
        })
        .catch(() =>
          this.error('Could not find story file.')))

  setStory = async (story: string, subStory?: string) => {
    const storyFile = await this.getStoryFile()
    const defaultProject = await this.userConfig.get('defaultProject')

    const contents = [story, subStory].map(suffix =>
      suffix && defaultProject && /^\d+$/.test(suffix) ? `${defaultProject}-${suffix}` : suffix
    ).join(' ')

    return fs.writeFile(storyFile, contents)
      .then(() => this.getStory())
      .then(updatedStory =>
        console.info(`Current story is now ${Object.values(updatedStory).join(' ').trim()}.`)
      )
  }
}

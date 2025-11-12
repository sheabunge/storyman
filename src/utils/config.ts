import { input, password } from '@inquirer/prompts'
import { UserConfigProps } from '../types/UserConfigProps'
import type { UserConfigSpecs } from '../types/UserConfigSpecs'
import { trimTrailingSlash } from './paths'

export const USER_CONFIG_FILENAME = '.storyman.json'

export const USER_CONFIG_SPEC: UserConfigSpecs<UserConfigProps> = {
  defaultAuthor: {
    defaultValue: ''
  },

  jiraUrl: {
    defaultValue: '',
    prompt: () =>
      input({
        message: 'Jira site URL:',
        validate: (value: string) => value.startsWith('http'),
        patternError: 'That doesn\'t appear to be a valid URL'
      }),
    parse: url => trimTrailingSlash(url.trim()) + '/'
  },

  jiraToken: {
    defaultValue: undefined,
    prompt: () =>
      password({
        message: 'Jira personal access token:'
      }),
    parse: token => Buffer.from(token.trim()).toString('base64')
  }
}

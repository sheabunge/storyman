import { Hook } from '@oclif/core'
import Get from '../commands/get'
import notFoundHook from '@oclif/plugin-not-found'

const hook: Hook.CommandNotFound = function(this, { argv, config }) {
  return !argv || argv.every(arg => arg.startsWith('-')) ?
    Get.run(argv) :
    notFoundHook.call(this, {
      config,
      id: argv.slice(0, 2).join(' '),
      argv: argv.slice(2)
    })
}

export default hook

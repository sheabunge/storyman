import AutocompleteIndex from '@oclif/plugin-autocomplete/lib/commands/autocomplete'
import { toSentenceCase } from '../utils'

export default class Autocomplete extends AutocompleteIndex {
  static description = toSentenceCase(AutocompleteIndex.description)
  static args = AutocompleteIndex.args
  static flags = AutocompleteIndex.flags
  static examples = AutocompleteIndex.examples
}

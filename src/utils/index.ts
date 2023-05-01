export * from './paths'
export * from './story'

export const toSentenceCase = (text: string) =>
  [text[0].toUpperCase(), text.slice(1), '.' === text.slice(-1) ? '' : '.'].join('')

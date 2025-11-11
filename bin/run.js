#!/usr/bin/env node

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
  const oclif = await import('@oclif/core')
  await oclif.execute({
    dir: __dirname,
    args: process.argv.length > 2 ? process.argv.slice(2) : ['get']
  })
})()

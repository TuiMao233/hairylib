#!/usr/bin/env node
import cac from 'cac'
import { actionBuilder } from '../commands/compile'
import { actionCreateTemplate } from '../commands/create'
import { actionSwagger } from '../commands/swagger'
import { version } from '../config'

const cli = cac('hairy')

cli.command('create <app-name>', 'create project to app-name dir').action((output) => actionCreateTemplate(output))

cli
  .command('dev', 'Observe the file or dir Bundle output')
  .option('-i, --input <dir/file>', `bundle's entry`)
  .option('-o, --output <dir/file>', `bundle's output`)
  .option('-t, --type', `build d.ts, but this slows down compilation`)
  .option('-l, --logger', `print log during build`)
  .option('-m, --meta', `Contains meta information files such as package.json, README.md`)
  .option('-ig, --ignore [source]', `Ignore partial files or folders for folder compilation`)
  .action((options) => actionBuilder({ ...options, mode: 'development' }))
cli
  .command('build', 'Build file or dir to output')
  .option('-i, --input <dir/file>', `bundle's entry`)
  .option('-o, --output <dir/file>', `bundle's output`)
  .option('-t, --type', `build d.ts, but this slows down compilation`)
  .option('-l, --logger', `print log during build`)
  .option('-m, --meta', `Contains meta information files such as package.json, README.md`)
  .option('-ig, --ignore [source]', `Ignore partial files or folders for folder compilation`)
  .action((options) => actionBuilder({ ...options, mode: 'production' }))

cli.command('swagger', 'Generate TypeScript files from swagger service').action(actionSwagger)

cli.help()
cli.version(version)
cli.parse()
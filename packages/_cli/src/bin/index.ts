#!/usr/bin/env node
import cac from 'cac'
import packageJson from '../../package.json'
import { actionBuilder } from '../compile'
import { actionCreateTemplate } from '../create'

const cli = cac('templa-cli')

cli
  .command('create <app-name>', 'create project to app-name dir')
  .action((output) => actionCreateTemplate(output))

cli
  .command('dev')
  .option('-i, --input <dir>', `bundle's entry`)
  .option('-o, --output <dir>', `bundle's output`)
  .action((options) => actionBuilder({ ...options, mode: 'development' }))
cli
  .command('build')
  .option('-i, --input <dir>', `bundle's entry`)
  .option('-o, --output <dir>', `bundle's output`)
  .action((options) => actionBuilder({ ...options, mode: 'production' }))

cli.help()
cli.version(packageJson.version)
cli.parse()

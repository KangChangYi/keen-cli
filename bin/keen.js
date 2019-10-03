#!/usr/bin/env node

const program = require('commander')

program.version('1.0.0', '-v, --version', '显示当前版本')
    .helpOption('-h, --help', '显示帮助')
    .usage('create <project-name>')
    .command('create <project-name>', '创建项目')
    .parse(process.argv)

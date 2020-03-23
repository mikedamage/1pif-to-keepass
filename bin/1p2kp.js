#!/usr/bin/env node
/* jshint node: true */

'use strict';

var _       = require('lodash');
var fs      = require('fs');
var path    = require('path');
var chalk   = require('chalk');
var Spinner = require('cli-spinner').Spinner;
var OPC     = require(path.join(__dirname, '..', 'index'));
var pkg     = require(path.join(__dirname, '..', 'package.json'));
var argv    = require('yargs')
  .demand(1)
  .option('o', {
    alias: 'output',
    description: 'Output file (\'-\' for stdout)',
    default: '-'
  })
  .option('h', { alias: 'help' })
  .help('help')
  .option('v', { alias: 'version' })
  .version(pkg.version, 'version', 'Display version information')
  .usage('1PIF to KeePass 2 Converter\n\nUsage: $0 INPUT [-o OUTPUT]')
  .example('$0 input.1pif -o output.xml')
  .example('$0 input.1pif -o - # STDOUT')
  .epilog('(C) 2015, Mike Green')
  .argv;

if (!fs.existsSync(argv._[0])) {
  console.log('File %s does not exist!', chalk.bold.red(argv._[0]));
  process.exit(1);
}

var counter   = 0;
var output    = (argv.output === '-') ? process.stdout : argv.output;
var converter = new OPC(argv._[0], { output: output });
var spinner   = new Spinner('%s converting...');

if (argv.output !== '-') {
  spinner.setSpinnerString('|/-\\');
  spinner.start();
}

converter.on('data', function(data) {
  counter++;
    process.stdout.write("" + counter + " entries exported\n")
});

converter.on('end', function() {
  if (argv.output !== '-') {
    spinner.stop(true);
    console.log('Saved %s entries to %s', chalk.bold(String(counter)), chalk.bold(argv.output));
  }
});

converter.start();

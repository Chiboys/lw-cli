#!/usr/bin/env node
const program = require('commander');
const ajv = require('../lib/ajv/index.js');

program.version('1.0.0', '-v --version');

// ajv data validator
program.command('ajv <dataJSONFile> <ajvSchemaJSFile>')
  .action(function (dataJSONFile, ajvSchemaJSFile) {
    return ajv.validator(dataJSONFile, ajvSchemaJSFile)
  });

program.parse(process.argv)
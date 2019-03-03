const resolve = require('resolve');
const ajv = require('./ajvGenerator');

exports.validator =  function validator (dataJSONPath, ajvSchemaJSPath) {
  const processCWD = process.cwd()
  let ajvSchema = null;
  // load ajv-schema
  try {
    let ajvPath = resolve.sync(ajvSchemaJSPath, { basedir: processCWD });
    if (!ajvPath.endsWith('.js')) {
      ajvPath += '.js';
    }
    ajvSchema = require(ajvPath);
  } catch (err) {
    console.error(`invalid ajvSchemaJSPath: '${ajvSchemaJSPath}':
    ${err.message}
    `);
    return;
  }

  // load json-data
  let dataJSON = null;
  try {
    let dataPath = resolve.sync(dataJSONPath, { basedir: processCWD });
    if (!dataJSONPath.endsWith('.json')) {
      dataPath += '.json';
    }
    dataJSON = require(dataPath);
  } catch (err) {
    console.error(`invalid dataJSONPath: '${dataJSONPath}':
    ${err.message}
    `);
    return;
  }

  if (typeof ajvSchema !== 'object'
  ) {
    return console.error('invalid ajvSchema and should be object data.');
  }

  if (typeof dataJSON !== 'object') {
    return console.error('invalid data and should be JSON object.');
  }

  if (!ajv.validateSchema(ajvSchema)) {
    return console.log(`invalid ajvSchema:
    ${JSON.stringify(ajv.errors, null, 4)}
    `);
  }
  const isValid = ajv.validate(ajvSchema, dataJSON);
  if (!isValid) {
    return console.info(` dataJSON is invalid: 
    ${JSON.stringify(ajv.errors, null, 4)} `);
  }

  console.info(` data JSON is valid
  ${JSON.stringify(dataJSON, null, 4)}
  `);
};

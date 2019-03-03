const Ajv = require('ajv')
const ajv = new Ajv()

ajv.addFormat('objectid', /^[a-z0-9]{24}$/);

// objectidwithnull format
ajv.addFormat('objectidornull', function (val) {
  return val === 'null' || /^[a-z0-9]{24}$/.test(val)
});

// 将字符串'null'转化为null
ajv.addKeyword('parseNull', {
  compile (schema) {
    return function (
      data,
      dataPath,
      parentData,
      parentDataProperty,
      rootData
    ) {
      if (typeof schema !== 'boolean') return false
      if (schema && data === 'null') parentData[parentDataProperty] = null
      return true
    }
  }
});

// 去掉字符串两边的空格
ajv.addKeyword('trim', {
  compile (schema) {
    return function (
      data,
      dataPath,
      parentData,
      parentDataProperty,
      rootData
    ) {
      if (typeof schema !== 'boolean') return false
      if (schema) parentData[parentDataProperty] = data.trim()
      return true
    }
  }
});

ajv.addKeyword('strict', {
  type: 'string',
  compile: (sch, parentSchema) => {
    return (data, dataPath, parentData, parentDataProperty, rootData) => {
      let maxLength = sch.maxLength || 100
      let minLength = sch.minLength || 1

      if (!(sch.trim === false)) parentData[parentDataProperty] = data.trim()

      if (!parentData[parentDataProperty]) return false
      if (parentData[parentDataProperty].length > maxLength) return false
      if (parentData[parentDataProperty].length < minLength) return false

      return true
    }
  }
});

// timezone
ajv.addFormat('timezone', {
  type: 'number',
  validate: inputZone => {
    return _.range(-12, 13)
      .map(zone => zone * 60)
      .includes(inputZone)
  }
});

// money
ajv.addFormat('money', {
  type: 'number',
  validate: val => {
    return /^\d+\.?\d{0,2}$/.test(val)
  }
});


module.exports = ajv;

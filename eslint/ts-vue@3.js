const basic = require('./config/basic')
const typescript = require('./config/typescript')
const vue = require('./config/vue@3')
const _ = require('lodash')

module.exports = _.merge(basic, typescript, vue)

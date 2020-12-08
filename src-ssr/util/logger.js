// ALL < TRACE < DEBUG < INFO < WARN < ERROR < FATAL < MARK < OFF - note that OFF is intended to be used to turn off logging, not as a level for actual logging, i.e. you would never call logger.off('some log message')
const _ = require('lodash')
const log4js = require('log4js')
const toFileLevel = ['info', 'warn', 'error', 'fatal', 'mark']
const fileAppenders = toFileLevel.map(level => `to${_.upperFirst(level)}File`)
const fileConfig = {
  type: 'multiFile',
  base: 'logs/',
  property: 'categoryName',
  pattern: 'yyyy-MM-dd.{level}',
  alwaysIncludePattern: true,
  extension: '.log',
  keepFileExt: true,
}
const fileAppendersConfigs = toFileLevel.reduce((pre, level) => {
  const f = `${level}File`
  return _.merge(pre, {
    [`to${_.upperFirst(level)}File`]: {
      type: 'logLevelFilter',
      appender: f,
      level,
      maxLevel: level,
    },
    [f]: _.merge({}, fileConfig, { pattern: `yyyy-MM-dd.${level}` }),
  })
}, {})
const appendersConfig = _.merge({ console: { type: 'console' } }, fileAppendersConfigs)
const config = {
  appenders: appendersConfig,
  categories: {
    default: {
      appenders: [...fileAppenders, 'console'],
      level: process.env.loggerLevel || 'ALL',
    },
  },
}
// console.info(JSON.stringify(config, null, 2))
// console.info(config)
log4js.configure(config)

const orgGetLogger = log4js.getLogger
const profile = {}
const NS_PER_SEC = 1e9
const MS_PER_SEC = 1e6
log4js.getLogger = category => {
  const l = orgGetLogger(category)
  l.time = name => {
    // console.time(name)
    profile[name] = process.hrtime()
  }
  l.timeEnd = (name, level) => {
    const diff = process.hrtime(profile[name])
    delete profile[name]
    const log = (level || 'info').toLowerCase()
    l[log](`${name}: durationMs = ${(diff[0] * NS_PER_SEC + diff[1]) / MS_PER_SEC} ms`)
    // console.timeEnd(name)
  }
  l.profile = (name, level) => {
    const start = profile[name]
    start ? l.timeEnd(name, level) : l.time(name)
    // if (start) {
    //   l.timeEnd(name, level)
    // } else {
    //   l.time(name)
    // }
  }
  return l
}
const morganLog = log4js.getLogger('morgan')
const loggerStream = {
  write: (message, encoding) => {
    morganLog.info(message)
  },
}

const logger = log4js.getLogger()

module.exports = {
  logger,
  log4js,
  loggerStream,
}

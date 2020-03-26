// // ALL < TRACE < DEBUG < INFO < WARN < ERROR < FATAL < MARK < OFF - note that OFF is intended to be used to turn off logging, not as a level for actual logging, i.e. you would never call logger.off('some log message')
// const _ = require('lodash')
// const log4js = require('log4js')
// const appenders =
//   [].findIndex((e) => e === process.env.NODE_ENV) > -1
//     ? ['console']
//     : ['console', 'file']
// log4js.configure({
//   appenders: {
//     console: {
//       type: 'console'
//     },
//     file: {
//       type: 'dateFile',
//       filename: 'logs/cabala',
//       alwaysIncludePattern: true,
//       pattern: '.yyyy-MM-dd.log',
//       // keepFileExt: true,
//       daysToKeep: 3
//     }
//   },
//   categories: {
//     default: {
//       appenders,
//       level: process.env.loggerLevel || 'ALL'
//     }
//   }
// })
// log4js.org_getLogger = log4js.getLogger
// const profile = {}
// const NS_PER_SEC = 1e9
// const MS_PER_SEC = 1e6
// log4js.getLogger = (category) => {
//   const l = log4js.org_getLogger(category)
//   l.time = (name) => {
//     // console.time(name)
//     profile[name] = process.hrtime()
//   }
//   l.timeEnd = (name, level) => {
//     const diff = process.hrtime(profile[name])
//     const log = (level || 'info').toLowerCase()
//     l[log](
//       `${name} durationMs = ${(diff[0] * NS_PER_SEC + diff[1]) / MS_PER_SEC} ms`
//     )
//     // console.timeEnd(name)
//   }
//   l.profile = (name, option) => {
//     // l.debug(profile)
//     const startOption = _.get(profile, [name])
//     // l.debug(profile, startOption)
//     if (startOption) {
//       const diff = process.hrtime(startOption.start)
//       const { level, label } = option || startOption.option || {}
//       const log = (level || 'info').toLowerCase()
//       l[log](
//         `${label || name} durationMs = ${(diff[0] * NS_PER_SEC + diff[1]) / MS_PER_SEC} ms`
//       )
//       delete profile[name]
//     } else {
//       _.set(profile, name, {
//         option,
//         start: process.hrtime()
//       })
//     }
//   }
//   // l.profile = async (func, options) => {
//   //   let s = process.hrtime()
//   //   let ex
//   //   let result = await func().catch(err => (ex = err))
//   //   let diff = process.hrtime(s)
//   //   let { level, label } = options || {}
//   //   let log = (level || 'info').toLowerCase()
//   //   l[log](`${label ? label + ' ' : ''}durationMs = ${(diff[0] * NS_PER_SEC + diff[1]) / MS_PER_SEC} ms`)
//   //   if (ex) {
//   //     throw ex
//   //   } else {
//   //     return result
//   //   }
//   // }
//   return l
// }
// const morganLog = log4js.getLogger('morgan')
// const loggerStream = {
//   write: (message, encoding) => {
//     morganLog.info(message)
//   }
// }

// const logger = log4js.getLogger()

// module.exports = {
//   logger,
//   log4js,
//   loggerStream
// }

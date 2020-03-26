const NS_PER_SEC = 1e9
const MS_PER_SEC = 1e6
const wrapAsync = func => async (req, res, next) => {
  const begin = process.hrtime()
  let result = null
  try {
    result = await func(req, res, next)
    res.status(200)
    // return Promise.resolve(func(req, res, next))
    //   .then(result => {
    //     log.info(`${apiName} done`)
    //     log.profile(`${apiName}`)
    //     return res.json(responseFormat(null, result))
    //   })
    //   .catch(error => {
    //     let result = responseFormat(error)
    //     let body = req.body
    //     // let query = req.query
    //     let url = req.url
    //     log.error(`${apiName} promise error is:\n${JSON.stringify(result)}!\nInput data is:\n${JSON.stringify({ body, url })}`)
    //     log.profile(`${apiName}`)
    //     return res.json(result)
    //   })
    //   .catch(next)
  } catch (error) {
    const { name, message, stack } = error
    result = { error: { name, message, stack } }
    res.status(500)
    // next
  } finally {
    const end = process.hrtime(begin)
    res.append('durationMs', (end[0] * NS_PER_SEC + end[1]) / MS_PER_SEC)
    res.json(result)
  }
}
module.exports = { wrapAsync }

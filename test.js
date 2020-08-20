const { reject } = require('lodash')

// const { durationMs } = require('./src-ssr/api/api')
const _ = require('lodash')

// async function test(a, b, c) {
//   return new Promise((resolve, reject) =>
//     setTimeout(() => {
//       if (a) {
//         resolve({ a, b, c })
//       } else {
//         reject('Op!')
//       }
//     }, 3000),
//   )
// }

const test = async () => {}

;(async () => {
  // const x = await durationMs(test)()
  const x = {
    title: 'Update - Master Recap',
    position: 1,
    isCustomerMenu: true,
    action: '\'Update "aaa"\'',
  }
  console.debug(JSON.stringify(JSON.stringify(x)).replace(/\\/g, '"'))
})()

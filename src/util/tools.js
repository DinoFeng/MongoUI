import {
  LocalStorage,
  // SessionStorage ,
} from 'quasar'
import _ from 'lodash'
import { dom } from 'quasar'
const tools = {
  saveServerConfigToLocal(config) {
    LocalStorage.set('servers', JSON.stringify(config))
  },
  getServerList() {
    const servers = LocalStorage.getItem('servers')
    if (servers) {
      return JSON.parse(servers)
    } else {
      return []
    }
  },
  saveAssignId(id) {
    LocalStorage.set('assignId', id)
  },
  getAssignId() {
    return LocalStorage.getItem('assignId')
  },
  // getCurrentServer() {
  //   const currentServer = LocalStorage.getItem('currentServer')
  //   if (currentServer) {
  //     return JSON.parse(currentServer)
  //   } else {
  //     return null
  //   }
  // },

  // setCurrentServer(data) {
  //   LocalStorage.set('currentServer', JSON.stringify(data))
  // },
  getType(v) {
    return (
      (_.isArray(v) && 'Array') ||
      (_.isPlainObject(v) && 'Object') ||
      (_.isDate(v) && 'Date') ||
      (_.isInteger(v) && 'Integer') ||
      (_.isNumber(v) && 'Number') ||
      (_.isBoolean(v) && 'Boolean') ||
      (_.isString(v) && 'String') ||
      (_.isNull(v) && 'Null')
    )
  },
  getDataDesc(data) {
    if (_.isArray(data)) {
      return `[ ${data.length} elements ]`
    } else if (_.isPlainObject(data)) {
      return `{ ${Object.keys(data).length} fields }`
    } else {
      return data
    }
  },
  getPaddingValue(ele) {
    const { style } = dom
    const top = _.toNumber(_.trimEnd(style(ele, 'padding-top'), 'px'))
    const bottom = _.toNumber(_.trimEnd(style(ele, 'padding-bottom'), 'px'))
    const left = _.toNumber(_.trimEnd(style(ele, 'padding-left'), 'px'))
    const right = _.toNumber(_.trimEnd(style(ele, 'padding-right'), 'px'))
    return { top, bottom, left, right }
  },
  getEleSizeValue(ele) {
    const { height, width } = dom
    const h = height(ele)
    const w = width(ele)
    return { height: h, width: w }
  },
  // getSystemVersion(){
  //   var version = navigator.userAgent
  // },
}
export default tools

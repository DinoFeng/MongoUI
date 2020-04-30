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
      (_.isPlainObject(v) && 'Document') ||
      (_.isDate(v) && 'Date') ||
      (_.isInteger(v) && 'Integer') ||
      (_.isNumber(v) && 'Number') ||
      (_.isBoolean(v) && 'Boolean') ||
      (_.isString(v) && 'String') ||
      (_.isNull(v) && 'Null')
    )
  },
  getTypeFromArraySchema(schema, value) {
    if (!_.isNil(schema) && !_.isEmpty(schema)) {
      const types = schema.filter(v => v.bsonType)
      if (types) {
        if (types.length === 1) {
          return this.convertSchema(types[0])
        } else {
          return this.parseMultiTypes(types, value)
        }
      }
    } else {
      return this.genVirtulSchema(value)
    }
  },
  genVirtulSchema(value) {
    const typeDesc = this.getType(value)
    return {
      typeDesc,
      childSchema: null,
      isExt: ['Document', 'Array'].includes(typeDesc),
      displayValue: v => {
        if (_.isArray(v)) {
          return `[ ${v.length} elements ]`
        } else if (_.isPlainObject(v)) {
          return `{ ${Object.keys(v).length} fields }`
        } else {
          return v
        }
      },
    }
  },
  convertSchema(schema) {
    const { bsonType, fields, types } = schema || {}
    return {
      typeDesc: bsonType,
      childSchema: fields ? { fields } : types ? types : {},
      isExt: ['Document', 'Array'].includes(bsonType),
      displayValue: v => {
        if (_.isArray(v)) {
          return `[ ${v.length} elements ]`
        } else if (_.isPlainObject(v)) {
          return `{ ${Object.keys(v).length} fields }`
        } else {
          return v && bsonType === 'ObjectID' ? `ObjectId("${v}")` : v
          // return
        }
      },
    }
  },
  parseMultiTypes(types, value) {
    if (_.isPlainObject(value)) {
      const t = types.find(v => v.bsonType === 'Document')
      return this.convertSchema(t)
    } else if (_.isArray(value)) {
      const t = types.find(v => v.bsonType === 'Array')
      return this.convertSchema(t)
    } else if (_.isNull(value)) {
      const t = types.find(v => v.bsonType === 'Null')
      return this.convertSchema(t)
    } else {
      const tl = types.filter(v => v && v.values && _.isArray(v.values) && v.values.includes(value))
      if (tl.length === 1) {
        return this.convertSchema(tl[0])
      } else {
        console.warn('!!!!!Doc!!!!!', tl, { types, value, isNull: _.isNull(value) })
        return { typeDesc: tl.map(({ bsonType }) => bsonType).join('/'), childSchema: {} }
      }
    }
  },
  getTypeFromDocSchema(schema, field, value) {
    if (!_.isNil(schema) && !_.isEmpty(schema)) {
      const types = _.get(schema, ['fields', field, 'types']).filter(v => v.bsonType)
      if (types) {
        if (types.length === 1) {
          return this.convertSchema(types[0])
        } else {
          return this.parseMultiTypes(types, value)
        }
      }
    } else {
      return this.genVirtulSchema(value)
    }
  },
  // getDataDesc(data) {
  //   if (_.isArray(data)) {
  //     return `[ ${data.length} elements ]`
  //   } else if (_.isPlainObject(data)) {
  //     return `{ ${Object.keys(data).length} fields }`
  //   } else {
  //     return data
  //   }
  // },
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

import { LocalStorage, SessionStorage } from 'quasar'
import _ from 'lodash'
import eJson from 'mongodb-extjson'
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
    SessionStorage.set('assignId', id)
  },
  getAssignId() {
    return SessionStorage.getItem('assignId')
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
  getBsonTypeName(v) {
    return (
      (_.isString(v) && 'String') ||
      (_.isDate(v) && 'Date') ||
      (v instanceof eJson.BSON.ObjectId && 'ObjectId') ||
      (v instanceof eJson.BSON.Int32 && 'Int32') ||
      (_.isNull(v) && 'Null') ||
      (_.isBoolean(v) && 'Boolean') ||
      (v instanceof eJson.BSON.Long && 'Long') ||
      (v instanceof eJson.BSON.Double && 'Double') ||
      (v instanceof eJson.BSON.Decimal128 && 'Decimal128') ||
      (v instanceof eJson.BSON.Timestamp && 'Timestamp') ||
      (v instanceof eJson.BSON.Binary && 'Binary') ||
      (v instanceof eJson.BSON.Code && 'Code') ||
      (v instanceof eJson.BSON.DBRef && 'DBRef') ||
      (v instanceof eJson.BSON.MaxKey && 'MaxKey') ||
      (v instanceof eJson.BSON.MinKey && 'MinKey') ||
      (v instanceof eJson.BSON.BSONRegExp && 'BSONRegExp') ||
      (v instanceof eJson.BSON.Symbol && 'Symbol') ||
      (_.isArray(v) && 'Array') ||
      (_.isPlainObject(v) && 'Object') ||
      (console.warn(v, 'type is Other!!') && 'Other')
    )
  },
  toDisplay: {
    ObjectId: v => `ObjectId("${v}")`,
    Array: v => `[${v.length} element${v.length > 1 ? 's' : ''}]`,
    Object: v => `{${Object.keys(v).length} field${Object.keys(v).length > 1 ? 's' : ''}}`,
  },
  typesMapping: {
    String: 'string',
    Date: 'date',
    ObjectId: 'objectId',
    Null: 'null',
    Boolean: 'boolean',
    Int32: 'number',
    Long: 'number',
    Double: 'double',
    Decimal128: 'double',
    Array: 'array',
    Object: 'object',
  },
  // toEditing: {
  //   Date: v => `ISODate("${v}")`,
  //   ObjectId: v => `ObjectId("${v}")`,
  // },
  parseBson(v) {
    if (_.isArray(v)) {
      const value = this.parseArrayBson(v)
      return {
        value,
        type: 'Array',
        isExt: true,
        _v: v,
        icon: this.typesMapping['Array'] || 'other',
        // getEditing: () => value.map(item => item.getEditing()),
        display: () => this.toDisplay['Array'](v),
      }
    } else if (_.isPlainObject(v)) {
      const value = this.parseDocBson(v)
      return {
        value,
        type: 'Object',
        isExt: true,
        _v: v,
        icon: this.typesMapping['Object'] || 'other',
        // getEditing: () =>
        //   Object.keys(value).reduce((pre, cur) => {
        //     return _.merge(pre, { [cur]: value[cur].getEditing() })
        //   }, {}),
        display: () => this.toDisplay['Object'](v),
      }
    } else {
      return this.parseValueBson(v)
    }
  },
  parseValueBson(value) {
    const type = this.getBsonTypeName(value)
    const display = () => JSON.parse(JSON.stringify(value))
    return {
      value,
      type,
      isExt: false,
      _v: value,
      icon: this.typesMapping[type] || 'other',
      // getEditing: () => (this.toEditing[type] ? this.toEditing[type](display) : display),
      display: () => (this.toDisplay[type] ? this.toDisplay[type](display()) : display()),
    }
  },
  parseDocBson(doc) {
    return Object.keys(doc).reduce((pre, cur) => {
      return _.merge(pre, { [cur]: this.parseBson(doc[cur]) })
    }, {})
  },
  parseArrayBson(array) {
    return array.map(v => this.parseBson(v))
  },
  // //****************************************************** */
  // getType(v) {
  //   return (
  //     (_.isArray(v) && 'Array') ||
  //     (_.isPlainObject(v) && 'Document') ||
  //     (_.isDate(v) && 'Date') ||
  //     (_.isInteger(v) && 'Integer') ||
  //     (_.isNumber(v) && 'Number') ||
  //     (_.isBoolean(v) && 'Boolean') ||
  //     (_.isString(v) && 'String') ||
  //     (_.isNull(v) && 'Null')
  //   )
  // },
  // getTypeFromArraySchema(schema, value) {
  //   if (!_.isNil(schema) && !_.isEmpty(schema)) {
  //     const types = schema.filter(v => v.bsonType)
  //     if (types) {
  //       if (types.length === 1) {
  //         return this.convertSchema(types[0])
  //       } else {
  //         return this.parseMultiTypes(types, value)
  //       }
  //     }
  //   } else {
  //     return this.genVirtulSchema(value)
  //   }
  // },
  // genVirtulSchema(value) {
  //   const typeDesc = this.getType(value)
  //   return {
  //     typeDesc,
  //     childSchema: null,
  //     isExt: ['Document', 'Array'].includes(typeDesc),
  //     displayValue: v => {
  //       if (_.isArray(v)) {
  //         return `[${v.length} elements ]`
  //       } else if (_.isPlainObject(v)) {
  //         return `{ ${Object.keys(v).length} fields } `
  //       } else {
  //         return v
  //       }
  //     },
  //   }
  // },
  // convertSchema(schema) {
  //   const { bsonType, fields, types } = schema || {}
  //   return {
  //     typeDesc: bsonType,
  //     childSchema: fields ? { fields } : types ? types : {},
  //     isExt: ['Document', 'Array'].includes(bsonType),
  //     displayValue: v => {
  //       if (_.isArray(v)) {
  //         return `[${v.length} elements ]`
  //       } else if (_.isPlainObject(v)) {
  //         return `{ ${Object.keys(v).length} fields } `
  //       } else {
  //         return v && bsonType === 'ObjectID' ? `ObjectId("${v}")` : v
  //       }
  //     },
  //   }
  // },
  // parseMultiTypes(types, value) {
  //   if (_.isPlainObject(value)) {
  //     const t = types.find(v => v.bsonType === 'Document')
  //     return this.convertSchema(t)
  //   } else if (_.isArray(value)) {
  //     const t = types.find(v => v.bsonType === 'Array')
  //     return this.convertSchema(t)
  //   } else if (_.isNull(value)) {
  //     const t = types.find(v => v.bsonType === 'Null')
  //     return this.convertSchema(t)
  //   } else {
  //     const tl = types.filter(v => v && v.values && _.isArray(v.values) && v.values.includes(value))
  //     if (tl.length === 1) {
  //       return this.convertSchema(tl[0])
  //     } else {
  //       console.warn('!!!!!Doc!!!!!', tl, { types, value, isNull: _.isNull(value) })
  //       return { typeDesc: tl.map(({ bsonType }) => bsonType).join('/'), childSchema: {} }
  //     }
  //   }
  // },
  // getTypeFromDocSchema(schema, field, value) {
  //   if (!_.isNil(schema) && !_.isEmpty(schema)) {
  //     const types = _.get(schema, ['fields', field, 'types']).filter(v => v.bsonType)
  //     if (types) {
  //       if (types.length === 1) {
  //         return this.convertSchema(types[0])
  //       } else {
  //         return this.parseMultiTypes(types, value)
  //       }
  //     }
  //   } else {
  //     return this.genVirtulSchema(value)
  //   }
  // },
  // // getDataDesc(data) {
  // //   if (_.isArray(data)) {
  // //     return `[${ data.length } elements ]`
  // //   } else if (_.isPlainObject(data)) {
  // //     return `{ ${ Object.keys(data).length } fields } `
  // //   } else {
  // //     return data
  // //   }
  // // },
  // //*************************************************************** */
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

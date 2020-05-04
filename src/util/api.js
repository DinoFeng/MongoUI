import _ from 'lodash'
import axios from 'axios'
// import keycloak from '../plugins/keycloak'
import assignManager from './assignManager'
// import { urlSetting } from '../consts/urlSetting'
// const myOptions = Symbol('myOptions')

const defaultOptions = {
  method: 'get',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  // credentials: 'same-origin',
  timeout: 0,
}

class API {
  static getUrlOption(urlSetting, apiName) {
    let host
    let option
    Object.keys(urlSetting).some(k => {
      if (_.get(urlSetting, [k, 'availableApis', apiName])) {
        host = _.get(urlSetting, [k, 'host'])
        option = _.get(urlSetting, [k, 'availableApis', apiName])
        return true
      }
    })
    return {
      host,
      option,
    }
  }

  static getUrl(urlSetting, apiName) {
    let urlOption = API.getUrlOption(urlSetting, apiName)
    const urlHostName = _.trimEnd(_.get(urlOption, ['host']), '/')
    const urlApi = _.trimStart(_.get(urlOption, ['option', 'url']), '/')
    return `${urlHostName}/${urlApi}`
  }

  // static async getVersion() {
  //   return axios
  //     .request({
  //       url: './statics/config/config.json',
  //       headers: {
  //         'Cache-Control': 'no-cache',
  //       },
  //     })
  //     .then(response => response.data)
  //     .then(cfg => cfg.version)
  //     .catch(error => {
  //       const { response, name, message, stack, config, request } = error
  //       if (response) {
  //         const { data, status, headers } = response
  //         const { error } = data
  //         if (error) {
  //           console.debug({ status, headers })
  //           console.error(error)
  //           throw error
  //         }
  //       }
  //       console.debug({ name, message, stack, config, request })
  //       throw error
  //     })
  // }

  constructor(uri, { pathParams, params, post, method, headers }, options) {
    let url = uri
    if (_.isString(url)) {
      if (!_.isNil(pathParams) && _.isPlainObject(pathParams)) {
        Object.keys(pathParams).forEach(key => {
          url = url.replace(`{${key}}`, encodeURIComponent(pathParams[key]))
        })
      }
    }

    if (!_.isNil(post) && _.isNil(method)) {
      method = 'post'
    }
    // headers = _.merge({}, { Authorization: `Bearer ${keycloak.token}` }, headers)
    // headers = _.merge({}, headers)
    if (!_.isString(assignManager.assignId)) {
      throw new Error(`Access ${url} without assign id !`)
      // } else {
      //   console.debug(assignManager.assignId)
    }
    headers = _.merge({}, { assignId: assignManager.assignId }, headers)
    // this[myOptions] = _.merge({}, defaultOptions, { url }, { params, data: post, method, headers })
    Object.defineProperty(this, 'option', {
      value: _.merge({}, defaultOptions, { url }, options, { params, data: post, method, headers }),
      writable: false,
    })
    console.debug('api.options', this.option)
    return this
  }

  async fetch(withValidate = true) {
    return axios
      .request(this.option)
      .then(response => {
        this.durationMs = _.get(response, ['headers', 'durationms'])
        return response.data
      })
      .then(data => {
        if (withValidate) {
          return this.validateResult(data)
        } else {
          return data
        }
      })
      .catch(error => {
        const { response, name, message, stack, config, request } = error
        if (response) {
          const { data, status, headers } = response
          const { error } = data
          if (error) {
            console.debug({ status, headers })
            console.error(error)
            throw error
          }
        }
        console.debug({ name, message, stack, config, request })
        throw error
      })
  }

  async validateResult(result) {
    if (result.resultType === 'SUCCESS') {
      return result.results
    } else {
      if (_.isNil(result.exceptionDetail) || _.isEmpty(result.exceptionDetail)) {
        throw new Error(result.resultMsg)
      } else {
        throw result.exceptionDetail
      }
    }
  }
}

export default API

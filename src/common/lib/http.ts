
import axios, { type AxiosError, type AxiosResponse, type AxiosRequestConfig } from 'axios'

import { type CommonError, type CommonResponse } from '../types/Response'
import _ from 'lodash'

const PROOFREAD_DOMAIN = location.origin

async function tryCatch<T, E = Error>(promise: Promise<T> | T): Promise<[T, null] | [null, E]> {
  try {
    const ret = await promise
    return [ret, null]
  } catch (e: any) {
    return [null, e]
  }
}

export const baseURL = location.hostname === '127.0.0.1' ? '//127.0.0.1:3001' : `${PROOFREAD_DOMAIN}/api/`
// export const baseURL = 'https://mmmrk.cn/api/'

/**
 * 原始请求方法
 * @usage
 *
 * ```
 * http({ method: 'GET', data: { a: 1 } })
 * http.get('/', { data: { a: 1 } })
 * http.post('/', { a: 1 })
 * http.del('/', { data: { a: 1 } })
 * http.put('/', { a: 1 })
 * http.patch('/', { a: 1 })
 * ```
 */
export const http = axios.create({
  withCredentials: true, // 跨域
  baseURL,
  timeout: 30000
  // xsrfCookieName: CSRF_COOKIE_NAME,
  // xsrfHeaderName: CSRF_HEADER_NAME,
  //   headers: {

  //   }
})

/**
 * 处理响应
 * 1. 针对 code 不为 0，或者 http 状态码大于等于 400，一律算作失败
 * 2. 将响应的错误格式化为 `CommonError`
 */

http.interceptors.response.use(
  async (res: AxiosResponse) => {
    const code = +_.get(res, 'data.code')
    const message = _.get(res, 'data.message')

    if (code !== 0) {
      return await Promise.reject({
        code,
        message,
        status: 200,
        rawResponse: res,
        rawError: null as unknown
      } as CommonError)
    }

    return res
  },
  async (err: AxiosError) => {
    const status = _.get(err, 'response.status', 200)
    const statusText = _.get(err, 'response.statusText')
    const code = +_.get(err, 'response.data.code', status)
    const message = _.get(err, 'response.data.message', statusText)

    return await Promise.reject({
      code,
      message,
      status,
      rawResponse: null as unknown,
      rawError: err
    } as CommonError)
  }
)

const requestResolve = (config: AxiosRequestConfig) => {
  (config as any).requestTime = new Date().getTime()
  return config as any
}

http.interceptors.request.use(requestResolve)

/**
 * 经过 tryCatch 封装的方法
 * @param {string} url 请求路径
 * @param {AxiosRequestConfig} config axios 原始配置
 * @return {[T, CommonError]} 返回一个元组，第一个为请求的结果，第二个为错误对象
 * ```
 * const [res, err] = await get('/', { params: { a: 1 } })
 * if (err) { return console.error(err) }
 * // 安全的访问 res
 * console.log(res.code)  // 0
 * ```
 */
export async function get<T = any>(url: string, data: any = {}, config?: AxiosRequestConfig) {
  return await tryCatch<CommonResponse<T>, CommonError>(http.get(url, { ...config, params: data }).then(res => res.data))
}

/**
 * 经过 tryCatch 封装的方法
 * @param {string} url 请求路径
 * @param {any} data 请求的数据
 * @param {AxiosRequestConfig} config axios 原始配置
 * @return {[T, CommonError]} 返回一个元组，第一个为请求的结果，第二个为错误对象
 * ```
 * const [res, err] = await post('/', { a: 1 })
 * if (err) { return console.error(err) }
 * // 安全的访问 res
 * console.log(res.code)  // 0
 * ```
 */
export async function post<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig) {
  return await tryCatch<CommonResponse<T>, CommonError>(http.post(url, data, config).then(res => res.data))
}

// export async function nodePost<T> (apiPath: string, data: unknown = {}) {
//   return await post<CommonResponse<T>>(apiPath, { apiPath, data })
// }

// export async function nodeGet<T> (apiPath: string, data: unknown = {}) {
//   return await get<CommonResponse<T>>(apiPath, data)
// }

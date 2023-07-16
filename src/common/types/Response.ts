import { type AxiosError, type AxiosResponse } from 'axios'

/**
 * 统一的响应类型
 * @param {any} T 数据类型
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export interface CommonCGWResponse<T = {}> {
  // 业务返回码
  code: number

  // 业务信息
  message: string

  // 业务信息
  msg?: string

  // 数据
  data: T
}

/**
 * 统一的接入层请求返回响应类型
 * @param {any} T 数据类型
 */
export type CommonResponse<T> = CommonCGWResponse<T>

/**
 * 统一的错误对象
 */
export interface CommonError {
  // 错误码
  code: number

  // 错误信息
  message: string

  // HTTP 状态码
  status: number

  // 原始响应
  // 如果返回的 HTTP 状态码 >= 400，则没有这个对象
  rawResponse?: AxiosResponse

  // 原始 axios 错误对象
  // 如果返回的 HTTP 状态码 < 400，则没有这个对象
  rawError?: AxiosError
}

// 统一的列表返回
export interface CommonList<T = any> {
  total: number | string
  list: T[]
}

// 某些接口没有遵循规范total/list的规范，这里新定义个
export interface CommonList2<T = any> {
  totalCount: number
  list: T[]
}

// 分页参数类型
export interface PageObject {
  pageIndex: number
  pageSize: number
  total: number
}

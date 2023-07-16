import { get, post } from '../../common/lib/http'

export async function uploadDocCheck(params: any) {
  return await post<{ taskId: string }>(
    '/proofread/uploadDocCheck',
    params,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
}

export async function queryTask(params: any) {
  return await get('/proofread/queryTask', params)
}

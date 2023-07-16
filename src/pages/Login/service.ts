import { post } from '../../common/lib/http'

export async function login (params: any) {
  return await post('/user/login', params)
}

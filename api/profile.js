import { request } from '@/plugins/request'

// 查询指定用户信息
export const getProfile = userName => {
  return request({
    method: 'GET',
    url: `/api/profiles/${userName}`
  })
}

// 关注用户
export const follow = userName => {
  return request({
    method: 'POST',
    url: `/api/profiles/${userName}/follow`
  })
}

// 取消关注用户
export const unFollow = userName => {
  return request({
    method: 'DELETE',
    url: `/api/profiles/${userName}/follow`
  })
}
import axios from '@/libs/api.request'
import qs from 'qs'

// export const login = ({ userName, password }) => {
//   const data = {
//     userName,
//     password
//   }
//   return axios.request({
//     url: 'login',
//     data,
//     method: 'post'
//   })
// }

// export const getUserInfo = (token) => {
//   return axios.request({
//     url: 'get_info',
//     params: {
//       token
//     },
//     method: 'get'
//   })
// }

// export const logout = (token) => {
//   return axios.request({
//     url: 'logout',
//     method: 'post'
//   })
// }

// export const getUnreadCount = () => {
//   return axios.request({
//     url: 'message/count',
//     method: 'get'
//   })
// }

export const getUnreadCount = () => {
  console.log('getUnreadCount 方法开始执行')
  return axios.request({
    url: 'usermessages/unreadcount',
    method: 'get'
  })
}

export const getMessage = () => {
  console.log('getMessage 方法开始执行')
  return axios.request({
    url: 'usermessages',
    method: 'get'
  })
}

export const getContentByMsgId = id => {
  return axios.request({
    url: 'usermessages/content',
    method: 'get',
    params: {
      id
    }
  })
}

export const hasRead = id => {
  console.log(id)
  return axios.request({
    url: 'usermessages/has_read',
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify({ id: id })
  })
}

export const removeReaded = id => {
  return axios.request({
    url: 'usermessages/remove_readed',
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify({ id: id })
  })
}

export const restoreTrash = id => {
  return axios.request({
    url: 'usermessages/restore',
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify({ id: id })
  })
}

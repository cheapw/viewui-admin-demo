import {
  // login,
  // logout,
  // getUserInfo,
  getMessage,
  getContentByMsgId,
  hasRead,
  removeReaded,
  restoreTrash,
  getUnreadCount
} from '@/api/user'

// import { getToken } from '@/libs/util'
import { UserManager } from 'oidc-client'
import config from '@/config'

export default {
  state: {
    userName: '',
    userId: '',
    userManager: new UserManager(config.authClientConfig),
    avatarImgPath: '',
    // token: getToken(),
    access: '',
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {}
  },
  mutations: {
    setAvatar (state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
      console.log('acess: ' + access)
    },
    // setToken (state, token) {
    //   state.token = token
    //   // setToken(token)
    // },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setMessageCount (state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList (state, list) {
      state.messageUnreadList = list
    },
    setMessageReadedList (state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList (state, list) {
      state.messageTrashList = list
    },
    updateMessageContentStore (state, { msg_id, content }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg (state, { from, to, msg_id }) {
      const index = state[from].findIndex(_ => _.id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    }
  },
  getters: {
    messageUnreadCount: state => state.messageUnreadList.length,
    messageReadedCount: state => state.messageReadedList.length,
    messageTrashCount: state => state.messageTrashList.length
  },
  actions: {
    // 登录
    // handleLogin ({ commit }, { userName, password }) {
    //   userName = userName.trim()
    //   return new Promise((resolve, reject) => {
    //     login({
    //       userName,
    //       password
    //     }).then(res => {
    //       const data = res.data
    //       commit('setToken', data.token)
    //       resolve()
    //     }).catch(err => {
    //       reject(err)
    //     })
    //   })
    // },
    handleLogin ({ state }) {
      state.userManager.signinRedirect()
      // var user = state.userManager.getUser()
      // if (user) {
      //   console.log(user)
      // }
    },
    // 退出登录
    // handleLogOut ({ state, commit }) {
    //   return new Promise((resolve, reject) => {
    //     logout(state.token).then(() => {
    //       commit('setToken', '')
    //       commit('setAccess', [])
    //       state.userManager.signoutRedirect()
    //       resolve()
    //     }).catch(err => {
    //       reject(err)
    //     })
    //     // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
    //     // commit('setToken', '')
    //     // commit('setAccess', [])
    //     // resolve()
    //   })
    // },
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        state.userManager.signoutRedirect()
        commit('setToken', '')
        commit('setAccess', [])
        resolve()
      })
    },
    getUser ({ state }) {
      // console.log('getUserManager:')
      // console.log(state.userManager)
      // console.log(state.userManager.getUser())
      return state.userManager.getUser()
    },
    // 获取用户相关信息
    // getUserInfo ({ state, commit }) {
    //   return new Promise((resolve, reject) => {
    //     try {
    //       getUserInfo(state.token).then(res => {
    //         const data = res.data
    //         commit('setAvatar', data.avatar)
    //         commit('setUserName', data.name)
    //         commit('setUserId', data.user_id)
    //         commit('setAccess', data.access)
    //         commit('setHasGetInfo', true)
    //         resolve(data)
    //       }).catch(err => {
    //         reject(err)
    //       })
    //     } catch (error) {
    //       reject(error)
    //     }
    //   })
    // },
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          state.userManager.getUser().then(res => {
            const data = res
            commit('setAvatar', data.profile.picture)
            commit('setUserName', data.profile.given_name)
            commit('setUserId', data.profile.sub)
            commit('setAccess', JSON.parse(data.profile.power))
            commit('setHasGetInfo', true)
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
    getUnreadMessageCount ({ state, commit }) {
      getUnreadCount().then(res => {
        // console.log('unread count: ' + res)
        const { unread_count } = res.data
        console.log('unread count: ' + unread_count)
        commit('setMessageCount', unread_count)
      })
    },
    // 获取消息列表，其中包含未读、已读、回收站三个列表
    getMessageList ({ state, commit }) {
      console.log('getMessageList 方法开始执行')
      return new Promise((resolve, reject) => {
        getMessage().then(res => {
          console.log('messageList: ' + res.data[0].title)
          // console.log(res.data[0].isRead)
          const unread = res.data.filter((item, index, array) => {
            return !item.isRead && !item.isDelete
          })
          const read = res.data.filter((item, index, array) => {
            return item.isRead && !item.isDelete
          })
          const trash = res.data.filter((item, index, array) => {
            return item.isRead && item.isDelete
          })
          // console.log(unread1)
          // const { unread, readed, trash } = res.data
          commit('setMessageUnreadList', unread.sort((a, b) => new Date(b.createTime) - new Date(a.createTime)))
          commit('setMessageReadedList', read.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.createTime) - new Date(a.createTime)))
          commit('setMessageTrashList', trash.map(_ => {
            _.loading = false
            return _
          }).sort((a, b) => new Date(b.createTime) - new Date(a.createTime)))
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 根据当前点击的消息的id获取内容
    getContentByMsgId ({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        let contentItem = state.messageContentStore[msg_id]
        if (contentItem) {
          resolve(contentItem)
        } else {
          getContentByMsgId(msg_id).then(res => {
            const content = res.data
            console.log(content)
            commit('updateMessageContentStore', { msg_id, content })
            resolve(content)
          })
        }
      })
    },
    // 把一个未读消息标记为已读
    hasRead ({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        hasRead(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageUnreadList',
            to: 'messageReadedList',
            msg_id
          })
          commit('setMessageCount', state.unreadCount - 1)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 删除一个已读消息到回收站
    removeReaded ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        removeReaded(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageReadedList',
            to: 'messageTrashList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 还原一个已删除消息到已读消息
    restoreTrash ({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        restoreTrash(msg_id).then(() => {
          commit('moveMsg', {
            from: 'messageTrashList',
            to: 'messageReadedList',
            msg_id
          })
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

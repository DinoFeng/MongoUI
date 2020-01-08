import {
  LocalStorage,
  // SessionStorage ,
} from 'quasar'
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
}
export default tools

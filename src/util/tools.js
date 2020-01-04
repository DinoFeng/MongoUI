import {
  LocalStorage,
  // SessionStorage,
} from 'quasar'
const tools = {
  getServerList() {
    const servers = LocalStorage.getItem('servers')
    if (servers) {
      return JSON.parse(servers)
    } else {
      return []
    }
  },
  // getCurrentServer() {
  //   const currentServer = LocalStorage.getItem('currentServer')
  //   if (currentServer) {
  //     return JSON.parse(currentServer)
  //   } else {
  //     return null
  //   }
  // },
  saveServerConfigToLocal(config) {
    LocalStorage.set('servers', JSON.stringify(config))
  },
  // setCurrentServer(data) {
  //   LocalStorage.set('currentServer', JSON.stringify(data))
  // },
}
export default tools

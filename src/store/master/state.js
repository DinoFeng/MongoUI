const state = {
  selectedServer: null,
  selectedDatabase: null,
  leftDrawerOpen: true,
  servers: null,
  // assignId: null,

  currentPage: 1,
  pageSize: 20,

  commandMode: 'find',
  find: {},
  aggregate: {},

  tableResult: {
    rows: [],
    total: 0,
  },
}
export default state

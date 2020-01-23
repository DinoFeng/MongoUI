const state = {
  selectedServer: null,
  selectedDatabase: null,
  leftDrawerOpen: true,
  servers: null,
  // assignId: null,

  pageSize: 20,
  findOptions: {},
  findQuery: {},
  currentPage: 1,

  tableResult: {
    rows: [],
    total: 0,
  },
}
export default state

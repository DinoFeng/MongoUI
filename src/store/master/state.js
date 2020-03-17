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
  durationMs: 0,

  insertDocumentEvent: false,
}
export default state

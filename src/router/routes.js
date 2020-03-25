const routes = [
  {
    path: '/',
    redirect: '/app',
  },
  {
    path: '/app',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue'),
        children: [
          {
            path: '',
            name: 'home',
            component: () => import('pages/Home.vue'),
          },
          {
            path: ':server/_Logs',
            name: 'serverLogs',
            component: () => import('pages/Logs.vue'),
          },
          {
            path: ':server/_Statistics',
            name: 'serverStatistics',
            component: () => import('pages/Statistics.vue'),
          },
          {
            path: ':server/:db/_Statistics',
            name: 'databaseStatistics',
            component: () => import('pages/Statistics.vue'),
          },
          {
            path: ':server/:db/:table/_Statistics',
            name: 'tableStatistics',
            component: () => import('pages/Statistics.vue'),
          },
          {
            path: ':server/_HostInfo',
            name: 'serverHost',
            component: () => import('pages/Statistics.vue'),
          },
          {
            path: ':server',
            name: 'server',
            component: () => import('pages/Server.vue'),
          },
          {
            path: ':server/:db',
            name: 'database',
            component: () => import('pages/Database.vue'),
          },
          {
            path: ':server/:db/:table',
            name: 'table',
            component: () => import('pages/Table.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/app/*',
    component: () => import('pages/Error404.vue'),
  },
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  })
}

export default routes

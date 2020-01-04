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
            path: ':server',
            component: () => import('pages/Server.vue'),
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

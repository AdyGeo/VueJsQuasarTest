
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('src/pages/TasksTemplate.vue'),
        name: 'Home'
      },
      { path: 'Tasks', component: () => import('src/pages/TasksTemplate.vue'),
        name: 'Tasks'
      },
      { path: 'Notes', component: () => import('src/pages/NotesTemplate.vue'),
        name: 'Notes'
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes

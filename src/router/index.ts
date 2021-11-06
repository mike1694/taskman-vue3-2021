import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Tasks from '../views/Tasks.vue';
import Create from '../views/Create.vue';
import Diary from '../views/Diary.vue';
import TaskCreate from '@/components/TaskCreate.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Tasks',
    component: Tasks
  },
  {
    path: '/create',
    name: 'Create',
    component: Create
  },
  {
    path: '/diary',
    name: 'Diary',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Diary.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

import { createRouter, createWebHistory } from 'vue-router';

const Index = () => import('../views/Index.vue');
const Kitchen = () => import('../views/Kitchen/index.vue');

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    meta: {
      title: '海岛生存'
    }
  },
  {
    path: '/kitchen',
    name: 'Kitchen',
    component: Kitchen,
    meta: {
      title: '中央厨房'
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
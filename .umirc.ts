import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  hash: true,
  history: {
    type: 'hash',
  },
  dva: {
    immer: true,
    hmr: false,
  },
  title: '物流系统',
  routes: [
    { path: '/', component: '@/pages/index' },
    { path: '/print/:id', component: '@/pages/print' },
    { path: '/login', component: '@/pages/login' },
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        { path: '/list', component: '@/pages/list' },
        { path: '/entering', component: '@/pages/editing' },
        { path: '/editing/:id', component: '@/pages/editing' },
      ],
      wrappers: [
        '@/wrappers/auth',
      ],
    },
  ],
});

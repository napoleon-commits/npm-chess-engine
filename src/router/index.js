import Vue from 'vue';
import Router from 'vue-router';
import Engine from '@/components/Engine';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Engine',
      component: Engine,
    },
  ],
});

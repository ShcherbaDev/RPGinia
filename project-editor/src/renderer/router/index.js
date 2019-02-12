import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'editor',
      component: require('@/components/Editor').default
    },
    {
      path: '/existing-error',
      name: 'existing-error',
      component: require('@/components/ProjectExistingError').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});

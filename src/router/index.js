import Vue from 'vue'
import Router from 'vue-router'
import GoodList from '@/views/goodList.vue'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    component: GoodList
  }
     
  ]
})
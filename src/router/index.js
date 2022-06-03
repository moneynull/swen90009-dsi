import Vue from 'vue'
import Router from 'vue-router'
import SearchPage from "../components/SearchPage";
import RankPage from "../components/RankPage";
import ArticalPage from "../components/ArticlePage";
import floatDialog from "../components/floatDialog";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SearchPage',
      component: SearchPage
    },{
      path: '/RankPage',
      name: 'RankPage',
      component: RankPage
    },{
      path: '/ArticlePage',
      name: 'ArticlePage',
      component: ArticalPage
    },{
      path:'/test',
      name: 'test',
      component: floatDialog
    }
  ]
})

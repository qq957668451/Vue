import Vue from 'vue'
import Router from 'vue-router'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import HelloWorld from '@/components/HelloWorld'
import Category from '@/pages/Category'
import User from '@/pages/User'
import Homepage from '@/pages/Homepage'
import Article from '@/pages/Article'
import Setting from '@/pages/setting/index'
import SettingInfo from '@/pages/setting/Info'
import SettingAuth from '@/pages/setting/Auth'
import SettingAdv from '@/pages/setting/Adv'

Vue.use(mavonEditor)
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/category',
      component: Category
    },{
      path: '/',
      component: Homepage
    },{
      path: '/article',
      component: Article
    },{
      path: '/user',
      component: User
    },{
    	path:'/setting',
    	component:Setting ,
    	children:[{
    		path:'info',                 /* /setting/info->SettingInfo*/
    		component:SettingInfo
    	},{
    		path:'auth',                 /* /setting/info->SettingAuth*/
    		component:SettingAuth
    	},{
    		path:'adv',                  /* /setting/info->SettingAdv*/
    		component:SettingAdv
    	}]
    }
  ]
})

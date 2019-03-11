// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import {
  format,
  setoption
} from './util'

Vue.config.productionTip = false
Vue.use(ElementUI);

Vue.prototype.$format = format // 格式化时间戳
Vue.prototype.$setoption = setoption // 设置option
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

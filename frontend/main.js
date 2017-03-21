import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './utils/router.js'
import store from './utils/store.js'
import socket from 'socket.io-client'
import VueResource from 'vue-resource'

Vue.use(VueResource);
Vue.use(VueRouter)
Vue.prototype.$socket = socket({path: '/api/socketio'});

new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App)
})

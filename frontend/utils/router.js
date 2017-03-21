import VueRouter from 'vue-router'
import control from '../components/control.vue'
import home from '../components/home.vue'

let routes = [
	{
		path: '/',
		component: home,
	},
	{
		path: '/control',
		component: control,
	},
]

export default new VueRouter({
	routes,
});
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import VueSocketIO from 'vue-socket.io';

Vue.config.productionTip = false;

Vue.use(
	new VueSocketIO({
		debug: true,
		connection: '//localhost',
		vuex: {
			store,
			actionPrefix: 'SOCKET_',
			mutationPrefix: 'SOCKET_'
		}
	})
);

new Vue({
	sockets: {
		playerJoinGame: function(data) {
			console.log('player joined game');
		}
	},
	router,
	store,
	render: h => h(App)
}).$mount('#app');

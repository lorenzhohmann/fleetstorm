import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import VueSocketIO from "vue-socket.io";

Vue.config.productionTip = false;

Vue.use(
	new VueSocketIO({
		debug: false,
		connection: "https://fleetstorm.lorenzhohmann.de",
		// connection: 'http://localhost:3000',
		vuex: {
			store,
			actionPrefix: "SOCKET_",
			mutationPrefix: "SOCKET_"
		}
	})
);

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount("#app");

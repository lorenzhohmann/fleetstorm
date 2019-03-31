import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
	plugins: [createPersistedState()],
	state: {
		game: null,
		player: null
	},
	mutations: {
		setGame(state, game) {
			state.game = game;
		},
		setPlayer(state, player) {
			state.player = player;
		}
	},
	actions: {
		setGame({commit}, game) {
			commit('setGame', game);
		},
		setPlayer({commit}, player) {
			commit('setPlayer', player);
		}
	}
});

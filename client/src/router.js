import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/Home.vue';
import Game from './components/Game.vue';
import CreateGame from './components/CreateGame.vue';
import EnterGame from './components/EnterGame.vue';
import WaitGame from './components/WaitGame.vue';
import Match from './components/Match.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/match',
      name: 'match',
      component: Match
    },
    {
      path: '/game',
      component: Game,
      children: [
        {
          path: 'create',
          component: CreateGame
        },
        {
          path: 'enter',
          component: EnterGame
        },
        {
          path: 'wait',
          component: WaitGame
        }
      ]
    }
  ]
});

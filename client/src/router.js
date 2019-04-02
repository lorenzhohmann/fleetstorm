import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/Home.vue';
import Game from './components/Game.vue';
import CreateGame from './components/CreateGame.vue';
import EnterGame from './components/EnterGame.vue';

import Match from './components/Match.vue';
import WaitingMatch from './components/WaitingMatch.vue';
import PlayingMatch from './components/PlayingMatch.vue';

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
      path: '/match/:gameCode',
      component: Match,
      children: [
        {
          path: '/',
          redirect: '/'
        },
        {
          path: 'waiting',
          component: WaitingMatch
        },
        {
          path: 'playing',
          component: PlayingMatch
        }
      ]
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
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
});

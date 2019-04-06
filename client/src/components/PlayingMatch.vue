<template>
	<div>
		<div
			class="alert"
			v-bind:class="{
				'alert-info': message.state == 'info',
				'alert-danger': message.state == 'danger',
				'alert-success': message.state == 'success'
			}"
			v-if="message.show"
		>
			{{ message.msg }}
		</div>
		<div class="choose-player-container section">
			<h3>Wähle einen Spieler den du angreifen möchtest</h3>
			<div class="entity-box">
				<button class="btn btn-primary mr-1">
					<i class="fas fa-skull mr-3"></i>Lorenz
				</button>
				<button class="btn btn-primary mr-1">
					<i class="fas fa-skull mr-3"></i>Tester
				</button>
				<button class="btn btn-primary mr-1">
					<i class="fas fa-skull mr-3"></i>Foobar
				</button>
			</div>
		</div>
		<div class="choose-player-container section">
			<h3>Gebiet von <b>Lorenz</b></h3>
		</div>
		<div class="choose-player-container section">
			<h3><b>Jana</b> ist am Zug</h3>
		</div>
	</div>
</template>

<script>
import GameService from '@/services/GameService.js';

export default {
	name: 'PlayingMatch',
	data() {
		return {
			game: {
				playerIDs: []
			},
			showCountdown: true,
			message: {
				show: false,
				msg: '',
				state: 'info'
			}
		};
	},
	async created() {
		// hide countdown after 5 seconds
		setTimeout(() => {
			this.showCountdown = false;
		}, 6000);

		// get gamCode for getting game
		const gameCode = this.$route.params.gameCode;
		try {
			GameService.getGame(gameCode).then(async game => {
				this.game = game;

				// check user rights, states, etc.
				this.startupCheck();
			});
		} catch (err) {
			this.$router.push({
				name: 'home',
				params: {
					error: 'Sorry, da ist etwas schief gelaufen.. (Fehlercode: #PM)'
				}
			});
		}
	},
	methods: {
		startupCheck() {},
		showMessage(msg, state = 'info') {
			this.message.msg = msg;
			this.message.state = state;
			this.message.show = true;
		},
		hideMessage() {
			this.message.show = false;
		}
	}
};
</script>

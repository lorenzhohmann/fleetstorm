<template>
	<div>
			<Matchfield v-bind:game="game" />
		</div>
	</div>
</template>

<script>
import GameService from '@/services/GameService.js';
import Matchfield from '@/components/Matchfield.vue';

export default {
	name: 'PlayingMatch',
	data() {
		return {
			game: null
		};
	},
	components: {
		Matchfield
	},
	async created() {
		const gameCode = this.$route.params.gameCode;
		try {
			GameService.getGame(gameCode).then(async game => {
				

				this.game = game;
			});
		} catch (err) {
			this.$router.push({
				name: 'home',
				params: {
					error: 'Sorry, da ist etwas schief gelaufen.. (Fehlercode: #PM)'
				}
			});
		}
	}
};
</script>

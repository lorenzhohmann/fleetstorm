<template>
	<div>
		<h2>Spiel beitreten</h2>

		<div class="content-container">
			<div class="row form-group">
				<div class="col">
					<input
						type="text"
						class="form-control"
						placeholder="Benutzername"
						v-model="username"
					/>
				</div>
				<div class="col">
					<input
						type="text"
						class="form-control"
						placeholder="Spiel-ID"
						v-model="gameCode"
					/>
				</div>
			</div>
			<button
				class="btn btn-success btn-block btn-lg"
				v-if="username != '' && gameCode != ''"
			>
				Spiel beitreten
			</button>
			<div class="alert alert-danger mt-3" v-if="error">{{ error }}</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'CreateGame',
	data() {
		return {
			gameCode: '',
			username: '',
			error: ''
		};
	}
};
</script>

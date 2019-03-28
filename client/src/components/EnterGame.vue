<template>
	<div>
		<h2>Spiel beitreten</h2>

		<div class="content-container">
			<div class="form-group">
				<input
					type="text"
					class="form-control"
					placeholder="Spiel-ID"
					v-model="gameID"
				/>
			</div>
			<div class="form-group">
				<input
					type="text"
					class="form-control"
					placeholder="Benutzername"
					v-model="username"
				/>
			</div>
			<button
				class="btn btn-success btn-block btn-lg"
				v-if="username != '' && gameID != ''"
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
			gameID: '',
			username: '',
			error: ''
		};
	}
};
</script>

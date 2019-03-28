<template>
	<div>
		<router-view />
		<router-link class="btn btn-secondary" to="/">Zurück</router-link>
	</div>
</template>

<script>
export default {
	name: 'home',
	methods: {
		async createPlayer() {}
	}
};
</script>
<style>
.content-container {
	padding: 3rem 0;
}
</style>

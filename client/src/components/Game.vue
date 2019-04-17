<template>
	<div>
		<transition name="fade" mode="out-in">
			<router-view />
		</transition>
		<router-link class="btn btn-secondary" to="/start"
			><i class="fas fa-arrow-left pr-2"></i> Zurück</router-link
		>
	</div>
</template>

<script>
export default {
	name: 'game'
};
</script>
<style>
.content-container {
	padding: 3rem 0;
}
</style>

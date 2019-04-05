<template>
	<div>
		<router-view />
		<router-link class="btn btn-secondary" to="/"
			><i class="fas fa-arrow-left pr-2"></i> Zurück</router-link
		>
	</div>
</template>

<script>
export default {
	name: 'home'
};
</script>
<style>
.content-container {
	padding: 3rem 0;
}
</style>

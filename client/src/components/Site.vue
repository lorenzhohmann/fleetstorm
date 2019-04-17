<template>
	<div>
		<div id="bg"></div>

		<div class="preloader">
			<div class="lds-ripple">
				<div></div>
				<div></div>
			</div>
		</div>

		<div class="container">
			<img src="../../public/img/logo.png" alt="Battleship Logo" class="logo" />
			<transition name="fade" mode="out-in">
				<router-view />
			</transition>
		</div>
	</div>
</template>
<script>
export default {
	name: 'site'
};
</script>

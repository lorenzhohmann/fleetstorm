<template>
	<div>
		<transition name="fade" mode="out-in">
			<router-view />
		</transition>
	</div>
</template>

<script>
import GameService from '@/services/GameService.js';

export default {
	name: 'Match'
};
</script>

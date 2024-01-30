<template>
	<div class="w-[500px]">
		<div class="grid grid-cols-7 border-b-2 border-slate-400">
			<p>#</p>
			<p class="col-span-3">Player</p>
			<p>Points</p>
			<p>Finishes</p>
			<p>Avg</p>
		</div>

		<div v-for="(item, index) in props.rankings" :key="item.steamid64" class="grid grid-cols-7 py-1 border-b border-slate-600">
			<p>{{ index + 1 }}</p>
			<RouterLink :to="{ name: 'stats', params: { steamid: item.steamid64 } }" class="col-span-3 text-[#00cec9] font-medium truncate">
				{{ item.player_name }}
			</RouterLink>
			<p>{{ item.points }}</p>
			<p>{{ item.finishes }}</p>
			<p>{{ Math.floor(item.average) }}</p>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	rankings: {
		type: Array,
		required: true
	}
})
</script>
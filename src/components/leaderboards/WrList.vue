<template>
	<div class="w-[300px]">
		<div class="grid grid-cols-4 border-b border-slate-400">
			<p class="col-span-3">Map</p>
			<p>Time</p>
		</div>

		<div v-for="wr in props.wrList" :key="wr.map_id" class="grid grid-cols-4">
			<p class="col-span-3">{{ wr.map_name }}</p>
			<p>{{ formatTime(wr.time) }}</p>
		</div>
	</div>
</template>

<script setup>
import formatTime from '../../time';
const props = defineProps({
	wrList: {
		type: Array,
		required: true	
	}
})
</script>
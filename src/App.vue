<template>
	<div class="flex flex-col bg-stats-primary min-h-screen font-Lora dark:text-slate-300 dark:bg-gray-900">
		<NavBar />
		<Suspense>
			<RouterView />
		</Suspense>
	</div>
</template>

<script setup>
import { provide, onBeforeMount } from 'vue';
import { RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';
import useMapStore from './store/maps'


const { fetchMaps, fetchWrs } = useMapStore()





provide('formatTime', (time) => {
	if (!time) return undefined;
	let hours = Math.floor(time / 3600);
	let mins = Math.floor(time / 60) - hours * 60;
	let secs = (time - hours * 3600 - mins * 60).toFixed(3);
	hours = hours > 0 ? hours + ':' : '';
	if (mins > 0) {
		mins = mins < 10 ? '0' + mins + ':' : mins + ':';
	} else {
		mins = '';
	}
	if (secs > 0) {
		secs = secs < 10 ? '0' + secs : secs;
	}
	let timeFmt = hours + mins + secs;
	return timeFmt;
})

</script>

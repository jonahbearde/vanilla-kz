<template>
	<div class="w-[800px] sm:w-full sm:overflow-hidden">
		<div class="grid grid-cols-9 text-xl font-semibold cursor-pointer border-b border-slate-600 dark:border-slate-400">
			<p class="col-span-3" @click="sortBy('map_name')">Map</p>
			<p @click="sortBy(props.has_teleports ? 'tpTier' : 'proTier')">Tier</p>
			<p @click="sortBy('time')">Time</p>
			<p @click="sortBy('points')">Points</p>
			<p @click="sortBy('teleports')">TPs</p>
			<p class="col-span-2" @click="sortBy('updated_on')">Date</p>
		</div>
		<div v-for="run in filteredRuns" :key="run.map_id"
			class="grid grid-cols-9 py-1 font-normal border-b border-slate-400 dark:border-slate-600">
			<div class="col-span-3 group flex relative items-center gap-2">
				<RouterLink target="_blank" :to="{ name: 'map', params: { mapname: run.map_name } }" class="cursor-pointer ">{{
					run.map_name }}</RouterLink>
				<i v-if="run.points === 1000" class="text-yellow-400 fa-solid fa-medal"></i>
				<img
					class="h-[120px] w-auto absolute top-4 left-20 z-[2] invisible group-hover:visible border-2 border-black dark:border-slate-600 rounded-md"
					:src="'https://raw.githubusercontent.com/KZGlobalTeam/map-images/public/mediums/' + run.map_name + '.jpg'"
					loading="lazy" onerror="this.onerror = null; this.src = '/loading.jpg'">
			</div>
			<p :style="{ color: tierColors[props.has_teleports ? run.tpTier - 1 : run.proTier - 1] }" class="font-semibold">
				{{ props.has_teleports ? run.tpTier : run.proTier }}
			</p>
			<p class="">{{ formatTime(run.time) }}</p>
			<p
				:style="{ color: run.points === 1000 ? '#facc15' : (run.points > 900 ? '#e84393' : (run.points > 800 ? '#e17055' : '')) }">
				{{ run.points }}</p>
			<p class="">{{ run.teleports }}</p>
			<p class="col-span-2 italic">
				{{ localDate(run.updated_on) }}
			</p>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import localDate from '../../date'
import { tierColors } from '../../constants';

const props = defineProps({
	runsData: {
		type: Array,
		required: true
	},
	mapSearch: {
		type: String,
		default: ''
	},
	has_teleports: {
		type: Boolean,
		required: true
	}
})


const formatTime = inject('formatTime')

const sortColumn = ref(null)


const desc = ref(false)

let current_column = 'updated_on'

const filteredRuns = computed(() => {
	if (props.mapSearch) {
		let pattern = new RegExp(props.mapSearch)

		return props.runsData.filter(run => pattern.test(run.map_name))
	}

	// reactive to sortColumn and desc
	return getSortedRuns(sortColumn.value, desc.value, props.runsData)

})

function sortBy(column) {

	sortColumn.value = column

	if (column === current_column) {
		desc.value = !desc.value
	} else {
		current_column = column
	}
}


function getSortedRuns(column, desc, runs) {

	if (!column) return runs

	if (column === 'time' || column === 'tpTier' || column === 'proTier' || column === 'points' || column === 'teleports') {
		return runs.sort((a, b) => {
			return desc ? a[column] - b[column] : b[column] - a[column];
		})
	}

	if (column === 'map_name' || column === 'updated_on') {
		return runs.sort((a, b) => {
			if (a[column] > b[column]) {
				return desc ? 1 : -1;
			}
			if (a[column] < b[column]) {
				return desc ? -1 : 1;
			}
			return 0;
		})
	}

}

</script>
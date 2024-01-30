<template>
	<div class="w-[500px] sm:overflow-hidden sm:pb-28">
		<!-- TODO: sort -->
		<div class="grid grid-cols-2 text-xl border-b border-black dark:border-slate-600">

			<div @click="sortBy('name')" class="font-medium cursor-pointer">
				Map
			</div>

			<div @click="sortBy(props.has_teleports ? 'tpTier' : 'proTier')" class="font-semibold cursor-pointer">
				Tier
			</div>

		</div>
		<!-- unfinished maps -->
		<div v-for="map in unfinished" :key="map.id"
			class="grid grid-cols-2 py-1 border-b border-slate-400 dark:border-slate-600">

			<div class="group relative">
				<RouterLink :to="{name: 'map', params: {mapname: map.name}}" class="cursor-pointer">
					{{ map.name }}
				</RouterLink>
				<img
					class="h-[120px] w-auto z-[2] absolute top-4 left-20 invisible group-hover:visible border-2 border-black dark:border-slate-600 rounded-md cursor-pointer"
					:src="'https://raw.githubusercontent.com/KZGlobalTeam/map-images/public/mediums/' + map.name + '.jpg'"
					loading="lazy" onerror="this.onerror = null; this.src = '/loading.jpg'">
			</div>

			<p :style="{ color: tierColors[props.has_teleports ? map.tpTier - 1 : map.proTier - 1] }" class="">
				{{ props.has_teleports ? map.tpTier : map.proTier }}
			</p>

		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import useMapStore from '../../store/maps';
import { tierColors } from '../../constants';

const mapStore = useMapStore()


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

const sortColumn = ref(null)

const desc = ref(false)

let current_column = 'map_name'

const unfinished = computed(() => {
	let unfList = []

	let runSet = new Set(props.runsData.map(record => record.map_id))

	// mapMap: [map id, map]
	for (let entry of mapStore.mapMap) {
		if (!runSet.has(entry[0]) && !(entry[1].name.startsWith('kzpro'))) {
			unfList.push(entry[1])
		}
	}

	if (props.mapSearch) {
		let pattern = new RegExp(props.mapSearch)

		return unfList.filter(map => pattern.test(map.name))
	}

	return getSortedUnfRuns(sortColumn.value, desc.value, unfList)

})


function sortBy(column) {

	sortColumn.value = column

	if (column === current_column) {
		desc.value = !desc.value
	} else {
		current_column = column
	}
}

function getSortedUnfRuns(column, desc, runs) {

	if (!column) return runs

	if (column === 'name') {
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

	if (column === 'tpTier' || column === 'proTier') {
		return runs.sort((a, b) => {
			return desc ? a[column] - b[column] : b[column] - a[column]
		})
	}
}

</script>
<template>
	<div>

		<div class="flex justify-center border-b border-black dark:border-slate-600 w-full py-4">
			<input v-model="searchQuery" @input="getSearchResults()" type="text" placeholder="search a map"
				class="w-[320px] text-slate-400 text-2xl text-center bg-transparent outline-none">
		</div>
		
		<!-- TP and Pro -->
		<div class="flex flex-col sm:flex-row">
			<div class="flex flex-col flex-1 border-b sm:border-r border-black dark:border-slate-600">

				<div class="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 mt-4">
					<p @click="toggleUnfinished(true)" class="text-yellow-600 font-bold text-3xl cursor-pointer">TP</p>
					<p @click="toggleUnfinished(true)"
						class="text-gray-400 text-sm border border-slate-400 rounded-md px-1 bg-gray-200 dark:bg-gray-600 cursor-pointer">
						Unfinished
					</p>
				</div>

				<!-- Recents -->
				<div v-if="showTpRuns" class="mx-4 sm:mx-8 my-4">

					<Runs has_teleports :runsData="props.tpData" :map-search="mapSearch" />

				</div>

				<div v-else class="mx-4 sm:mx-auto my-4">

					<Unfinished has_teleports :runsData="props.tpData" :map-search="mapSearch" />

				</div>

			</div>


			<div class="flex flex-col flex-1 border-b sm:border-r border-black dark:border-slate-600">

				<div class="flex items-center justify-center gap-6 mt-4">
					<p @click="toggleUnfinished(false)" class="text-blue-600 font-bold text-3xl cursor-pointer">PRO</p>
					<p @click="toggleUnfinished(false)"
						class="text-gray-400 text-sm border border-slate-400 rounded-md px-1 bg-gray-200 dark:bg-gray-600 cursor-pointer">
						Unfinished
					</p>
				</div>

				<!-- Recents -->
				<div v-if="showProRuns" class="mx-4 sm:mx-8 my-4">

					<Runs :has_teleports="false" :runsData="props.proData" :map-search="mapSearch" />

				</div>

				<div v-else class="mx-4 sm:mx-auto my-4">

					<Unfinished :has_teleports="false" :runsData="props.proData" :map-search="mapSearch" />

				</div>

			</div>

		</div>

	</div>
</template>

<script setup>
import { ref } from 'vue';
import Runs from './Runs.vue';
import Unfinished from './Unfinished.vue';

const props = defineProps({
	tpData: {
		type: Object,
		required: true
	},
	proData: {
		type: Object,
		required: true
	}
})


const searchQuery = ref(null)
const mapSearch = ref(null)


const showTpRuns = ref(true)
const showProRuns = ref(true)

const queryTimeout = ref(null)


function toggleUnfinished(has_teleports) {
	if (has_teleports) showTpRuns.value = !showTpRuns.value
	else showProRuns.value = !showProRuns.value
}

function getSearchResults() {
	clearTimeout(queryTimeout.value)

	queryTimeout.value = setTimeout(() => {
		mapSearch.value = searchQuery.value
	}, 300)
}

</script>
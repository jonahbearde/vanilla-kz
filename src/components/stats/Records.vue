<template>
	<div>

		<div class="flex justify-center border-b border-black dark:border-slate-600 w-full py-4">
			<input v-model="searchQuery" @input="getSearchResults()" type="text" placeholder="Search"
				class="w-[320px] text-slate-400 text-2xl text-center bg-transparent outline-none">
		</div>

		<!-- TP and Pro -->
		<div class="flex flex-col sm:flex-row">
			<div class="flex flex-col flex-1 border-b sm:border-r border-black dark:border-slate-600">

				<div class="flex flex-col items-center gap-2  mt-4">
					<p class="text-yellow-600 font-bold text-3xl">TP</p>
					<p @click="toggleFinished(true)" :class="showTpRuns ? 'text-gray-400' : 'text-green-400'"
						class="text-sm border border-slate-400 rounded-md px-1 bg-gray-200 dark:bg-gray-600 cursor-pointer">
						{{ showTpRuns ? 'Unfinished' : 'Finished' }}
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

				<div class="flex flex-col  items-center gap-2  mt-4">
					<p class="text-blue-600 font-bold text-3xl">PRO</p>
					<p @click="toggleFinished(false)" :class="showProRuns ? 'text-gray-400' : 'text-green-400'"
						class="text-sm border border-slate-400 rounded-md px-1 bg-gray-200 dark:bg-gray-600 cursor-pointer">
						{{ showProRuns ? 'Unfinished' : 'Finished' }}
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


function toggleFinished(has_teleports) {
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
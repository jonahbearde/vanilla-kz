<template>
	<div>
		<div v-if="loading">
			<LoadingBar />
		</div>

		<div v-else class="flex flex-col sm:flex-row justify-evenly mt-4 mb-32">
			<!-- TP rankings -->
			<div class="flex flex-col items-center">
				<p class="text-3xl font-semibold text-yellow-600 mb-2">TP</p>
				<WrTable :rankings="tpRankings" />
			</div>
			<div class="flex flex-col items-center">
				<p class="text-3xl font-semibold text-blue-600 mb-2">PRO</p>
				<WrTable :rankings="proRankings" />
			</div>
		</div>

	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axiosClient from '../../axios'
import WrTable from './WrTable.vue';
import LoadingBar from '../LoadingBar.vue';

const loading = ref(true)

const tpRankings = ref([])
const proRankings = ref([])

onMounted(async () => {
	loading.value = true

	try {
		const result = await axiosClient.get('/wrs')

		const tpWrs = result.data.filter(wr => wr.has_teleports)
		const proWrs = result.data.filter(wr => !wr.has_teleports)

		tpRankings.value = calculateRankings(tpWrs)

		proRankings.value = calculateRankings(proWrs)
		
	} catch (error) {
		console.log(error)
	} finally {
		loading.value = false
	}
})


function calculateRankings(wrs) {

	const playerWrs = {}

	for (const wr of wrs) {
		const id = wr.steamid64

		if (playerWrs[id]) {
			playerWrs[id].push(wr)
		} else {
			playerWrs[id] = [wr]
		}
	}

	return Object.entries(playerWrs)
		.map(entry => {
			return {
				player_name: entry[1][0].player_name,
				steamid64: entry[0],
				wrs: entry[1].sort(wrSortFn),
				count: entry[1].length
			}
		})
		.sort((a, b) => b.count - a.count)

}

function wrSortFn(a, b) {
	if (a.map_name < b.map_name) return -1
	if (a.map_name > b.map_name) return 1
	return 0
}

</script>
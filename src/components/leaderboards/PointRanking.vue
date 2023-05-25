<template>
	<div>
		<div v-if="loading">
			<LoadingBar />
		</div>
		<div v-else class="flex flex-col sm:flex-row justify-evenly px-2 mt-4 mb-32 overflow-x-auto">
			<!-- TP rankings -->
			<div>
				<p class="text-3xl font-semibold text-yellow-600 w-max mx-auto mb-2">TP</p>
				<PointsTable :rankings="tpRankings" />
			</div>
			<div>
				<p class="text-3xl font-semibold text-blue-600 w-max mx-auto mb-2">PRO</p>
				<PointsTable :rankings="proRankings" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios';
import LoadingBar from '../LoadingBar.vue';
import PointsTable from './PointsTable.vue'
import { globalApiBaseUrl } from '../../constants'

const loading = ref(true)

const tpRankings = ref(null)
const proRankings = ref(null)

onMounted(async () => {
	loading.value = true

	try {


		const tpResult = await axios.get(`${globalApiBaseUrl}/player_ranks?stages=0&mode_ids=202&has_teleports=true&limit=40`)

		tpRankings.value = tpResult.data

		const proResult = await axios.get(`${globalApiBaseUrl}/player_ranks?stages=0&mode_ids=202&has_teleports=false&limit=40`)

		proRankings.value = proResult.data

	} catch (error) {
		console.log(error)
	} finally {
		loading.value = false
	}
})


</script>
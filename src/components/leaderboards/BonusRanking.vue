<template>
	<div>
		<div v-if="loading">
			<LoadingBar />
		</div>
		<div v-else class="flex flex-col sm:flex-row justify-evenly mt-4 mb-32">
			<!-- TP rankings -->
			<div class="flex flex-col items-center">
				<p class="text-3xl font-semibold text-yellow-600 mb-2">TP</p>
				<WrTable bonus :rankings="tpRankings" />
			</div>
			<div class="flex flex-col items-center">
				<p class="text-3xl font-semibold text-blue-600 mb-2">PRO</p>
				<WrTable bonus :rankings="proRankings" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios';
import LoadingBar from '../LoadingBar.vue';
import WrTable from './WrTable.vue';
import {globalApiBaseUrl} from '../../constants'

const loading = ref(true)

const tpRankings = ref(null)
const proRankings = ref(null)

onMounted(async () => {
	loading.value = true
	try {
		let stageQuery = ''
		for (let i = 1; i <= 50; i++) {
			stageQuery += 'stages=' + i + '&'
		}

		const tpResult = await axios.get(`${globalApiBaseUrl}/records/top/world_records?${stageQuery}mode_ids=202&has_teleports=true`)

		tpRankings.value = tpResult.data

		const proResult = await axios.get(`${globalApiBaseUrl}/records/top/world_records?${stageQuery}mode_ids=202&has_teleports=false`)

		proRankings.value = proResult.data

	} catch (error) {
		console.log(error)
	} finally {
		loading.value = false
	}
})
</script>
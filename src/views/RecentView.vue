<template>
	<div>

		<div v-if="loading">
			<LoadingBar />
		</div>

		<div v-else class="flex flex-col sm:flex-row">

			<!-- annoucements -->
			<News />

			<!-- recent records -->
			<div class="flex flex-1 flex-col sm:flex-row items-center justify-evenly px-1 sm:px-4 py-4">

				<!-- pro wrs -->
				<div class="flex w-max flex-col">
					<p class="self-center text-3xl font-medium text-blue-600">PRO WRs</p>
					<WrCard v-for="wr in proWrs" :key="wr.id" :has_teleports="wr.teleports > 0" :wr="wr" />
				</div>

				<!-- tp wrs -->
				<div class="flex w-max flex-col">
					<p class="self-center text-3xl font-medium text-yellow-600">TP WRs</p>
					<WrCard v-for="wr in tpWrs" :key="wr.id" :has_teleports="wr.teleports > 0" :wr="wr" />
				</div>

				<!-- top50 -->
				<div class="flex w-max flex-col">
					<p class="self-center text-3xl font-medium text-cyan-600">TOP 50</p>
					<WrCard v-for="wr in top50" :key="wr.id" showPlace :has_teleports="wr.teleports > 0" :wr="wr" />
				</div>

			</div>

		</div>

	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import WrCard from "../components/recent/WrCard.vue";
import News from "../components/recent/News.vue";
import LoadingBar from '../components/LoadingBar.vue';
import useMapStore from '../store/maps';
import axiosClient from '../axios';
import { globalApiBaseUrl } from '../constants';

const mapStore = useMapStore()

const { fetchMaps } = mapStore

const loading = ref(true)

const tpWrs = ref(null)

const proWrs = ref(null)

const top50 =ref(null)

onMounted(async () => {
	loading.value = true
	try {
		await fetchMaps()
		await fetchTop()
	} catch (error) {
		console.log(error)
	} finally {
		loading.value = false
	}
})

async function fetchTop() {

	try {
		let top = await Promise.all([
			axiosClient.get(`${globalApiBaseUrl}/records/top/recent?modes_list_string=kz_vanilla&tickrate=128&stage=0&has_teleports=true&place_top_at_least=1&limit=30`),
			axiosClient.get(`${globalApiBaseUrl}/records/top/recent?modes_list_string=kz_vanilla&tickrate=128&stage=0&has_teleports=false&place_top_at_least=1&limit=30`),
			axiosClient.get(`${globalApiBaseUrl}/records/top/recent?modes_list_string=kz_vanilla&tickrate=128&stage=0&place_top_at_least=50&limit=30`)
		])

		tpWrs.value = top[0].data
		proWrs.value = top[1].data
		top50.value = top[2].data

	} catch (error) {
		return error
	}
}


</script>

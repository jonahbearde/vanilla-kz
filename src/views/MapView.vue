<template>
	<div class="flex flex-col sm:flex-row">

		<MapCard v-if="map && bonuses" :map="map" :pb-tp="pbTp" :pb-pro="pbPro" :bonuses="bonuses" @toggle-stage="toggleStage" />

		<div v-if="loading" class="mx-auto">
			<LoadingBar />
		</div>

		<!-- records -->
		<div v-else class="flex flex-1 flex-col overflow-auto">
			<div class="flex flex-col sm:flex-row">

				<div class="flex-1 border-b sm:border-r border-black dark:border-slate-600 pb-2">
					<div class="flex justify-center text-yellow-600 font-bold text-4xl cursor-pointer my-4">TP</div>

					<div class="mx-2 sm:mx-6">
						<Runs has_teleports :runs="tpTop" />
					</div>
				</div>

				<div class="flex-1 border-b border-black dark:border-slate-600 pb-2">
					<div class="flex justify-center text-blue-600 font-bold text-4xl cursor-pointer my-4">PRO</div>

					<div class="mx-2 sm:mx-6">
						<Runs :has_teleports="false" :runs="proTop" />
					</div>
				</div>

			</div>

		</div>

	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios'
import axiosClient from '../axios';
import { globalApiBaseUrl } from '../constants';
import useUserStore from '../store/user'
import MapCard from '../components/map/MapCard.vue';
import Runs from '../components/map/Runs.vue';
import LoadingBar from '../components/LoadingBar.vue'


const route = useRoute()

const map_name = route.params.mapname


const userStore = useUserStore()

const loading = ref(true)


const map = ref(null);
const bonuses = ref([]);


const pbTp = ref(0);
const pbPro = ref(0);

const tpTop = ref([])
const proTop = ref([])


onMounted(async () => {

	loading.value = true

	try {

		await getMapData()

		await getRuns()

		await getPb()

	} catch (error) {
		console.log(error)
	} finally {
		loading.value = false
	}

})

async function getMapData() {
	try {

		const mapData = await axiosClient.get(`/maps/${map_name}`)

		map.value = mapData.data

		const bonusData = await axiosClient.get(`/bonus/${map_name}`)

		bonuses.value = bonusData.data;
	} catch (error) {
		console.log(error)
	}
}

async function getPb() {
	try {

		if (userStore.steamid) {

			const tpResult = await axios.get(`${globalApiBaseUrl}/records/top?steamid64=${userStore.steamid}&map_name=${map_name}&stage=0&modes_list_string=kz_vanilla&has_teleports=true`)
			const proResult = await axios.get(`${globalApiBaseUrl}/records/top?steamid64=${userStore.steamid}&map_name=${map_name}&stage=0&modes_list_string=kz_vanilla&has_teleports=false`)

			pbTp.value = tpResult.data.length > 0 ? tpResult.data[0].time : 0
			pbPro.value = proResult.data.length > 0 ? proResult.data[0].time : 0
		}

	} catch (error) {
		console.log(error);
	}
}



async function getRuns(stage = 0) {
	try {

		const tpTopData = await axios.get(`${globalApiBaseUrl}/records/top?map_name=${map_name}&stage=${stage}&modes_list_string=kz_vanilla&has_teleports=true&limit=50`)

		tpTop.value = tpTopData.data


		const proTopData = await axios.get(`${globalApiBaseUrl}/records/top?map_name=${map_name}&stage=${stage}&modes_list_string=kz_vanilla&has_teleports=false&limit=50`)

		proTop.value = proTopData.data

	} catch (error) {
		console.log(error);
	}

}

async function toggleStage(stage) {
	loading.value = true

	try {

		await getRuns(stage)

	} catch (error) {
		console.log(error)
	} finally {
		loading.value = false
	}
}

</script>
<template>
	<div>
		<div v-if="loading">
			<LoadingBar />
		</div>

		<div v-else>

			<div class="flex flex-col items-center border-b border-black dark:border-slate-600">
				<p class="text-2xl font-medium pt-4">Feasible Maps</p>
				<p class="italic text-gray-400 pt-2">Can be finished by a human but has no global finish yet.</p>
				<div class="flex flex-wrap justify-center gap-6 py-6">
					<div v-for="map in mapStore.feasible" :key="map.map_id"
						class="group relative flex flex-col items-center border-2 border-black dark:border-slate-600 rounded-sm">
						<p>{{ map.map_name }}</p>
						<img
							:src="'https://raw.githubusercontent.com/KZGlobalTeam/map-images/public/mediums/' + map.map_name + '.jpg'"
							onerror="this.onerror = null; this.src = '/loading.jpg'" loading="lazy"
							class="h-[148px] w-[256px] fade-in border-y border-black dark:border-slate-600">
						<div class="flex gap-2 w-full justify-center">
							<p class="text-yellow-600">{{ map.kztTier }}</p>
						</div>
						<div v-html="map.notes"
							class="group-hover:visible invisible absolute p-1 top-40 border border-black dark:border-slate-600 bg-neutral-200 dark:bg-gray-800 w-[250px] rounded-md">
						</div>
					</div>
				</div>
			</div>

			<div class="flex flex-col items-center">
				<p class="text-2xl py-4 font-medium">Impossible Maps</p>
				<p class="italic text-gray-400">Maps thought to be impossible on VNL settings with or without TAS tools or cheats.
				</p>
				<input v-model="mapSearch" @input="getSearchResults" type="text" placeholder="Search"
					class="w-[320px] text-slate-400 text-2xl text-center bg-transparent outline-none pt-2">

				<div class="flex flex-wrap justify-center gap-6 py-6">
					<div v-for="map in impossibles" :key="map.map_id"
						class="group relative flex flex-col items-center border-2 border-black dark:border-slate-600 rounded-sm">

						<p>{{ map.map_name }}</p>

						<a :href="`https://kzgo.eu/maps/${map.map_name}`" target="_blank">
							<img
								:src="'https://raw.githubusercontent.com/KZGlobalTeam/map-images/public/mediums/' + map.map_name + '.jpg'"
								onerror="this.onerror = null; this.src = '/loading.jpg'" loading="lazy"
								class="h-[148px] w-[256px] fade-in border-y border-black dark:border-slate-600">
						</a>

						<div class="flex gap-2 w-full justify-center">
							<p class="text-yellow-600">{{ map.kztTier }}</p>
						</div>

						<div v-html="map.notes"
							class="group-hover:visible invisible z-[1] absolute p-1 top-40 border border-black dark:border-slate-600 bg-neutral-200 dark:bg-gray-800 w-[250px] rounded-md">
						</div>

					</div>
				</div>

			</div>

		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import useMapStore from '../../store/maps';
import LoadingBar from '../../components/LoadingBar.vue';

const mapStore = useMapStore()

const { fetchUncompleted } = mapStore

const loading = ref(true)

const mapSearch = ref(null)

const impossibles = computed(() => {
	if (mapSearch.value) {
		const pattern = new RegExp(mapSearch.value)

		return mapStore.impossible.filter(map => pattern.test(map.map_name))
	}

	return mapStore.impossible
})

onMounted(async () => {
	loading.value = true

	try {
		await fetchUncompleted()
	} catch (error) {
		console.log(error)
	} finally {
		loading.value = false
	}
})

function getSearchResults() {

}

</script>

<style scoped>
.fade-in {
  animation: fadeIn ease 1s;
  -webkit-animation: fadeIn ease 1s;
  -moz-animation: fadeIn ease 1s;
  -o-animation: fadeIn ease 1s;
  -ms-animation: fadeIn ease 1s;
}
@keyframes fadeIn {
  0% {opacity:0;}
  100% {opacity:1;}
}
</style>

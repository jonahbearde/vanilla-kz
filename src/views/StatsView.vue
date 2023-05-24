<template>
	<div class="overflow-auto">

		<div v-if="loading">
			<LoadingBar />
		</div>

		<div v-else>
			<!-- info -->
			<div class="flex flex-col sm:flex-row items-center py-3 sm:py-1 border-b border-black dark:border-slate-600">
				<Info :unknown="unknownUser" :steam-user="steamUser" :info="info" />
				<form @submit.prevent="loadStats()" class="flex flex-1 items-center justify-end px-6 text-xl">
					<input v-model="idInput" type="text" placeholder="Steam ID or 64"
						class="w-[220px] text-center text-slate-400 bg-transparent outline-none">
					<i @click="loadStats()" class="fa-solid fa-magnifying-glass cursor-pointer"></i>
				</form>
			</div>
			<!-- completions -->
			<div class="flex flex-col sm:flex-row justify-evenly border-b border-black dark:border-slate-600">
				<!-- TP -->
				<div class="flex flex-col items-center px-4 py-5">
					<p
						class="px-3 border border-slate-400 dark:border-slate-600 rounded-md text-yellow-800 text-2xl font-bold bg-yellow-600 mb-2">
						TP
					</p>
					<Completions isTp :completions="tpCompletions" />
				</div>
				<!-- PRO -->
				<div class="flex flex-col items-center px-4 py-5">
					<p
						class="px-2 border border-slate-400 dark:border-slate-600 rounded-md text-blue-600 text-2xl font-bold bg-blue-300 mb-2">
						PRO
					</p>
					<Completions :isTp="false" :completions="proCompletions" />
				</div>
			</div>
			<Records :tpData="tpRuns" :proData="proRuns" />
		</div>

	</div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router'
import axios from 'axios';
import { storeToRefs } from 'pinia';
import SteamID from 'steamid';
import Records from '../components/stats/Records.vue';
import Info from '../components/stats/Info.vue'
import Completions from '../components/stats/Completions.vue';
import { levels, globalApiBaseUrl } from '../constants';
import useUserStore from '../store/user';
import useMapStore from '../store/maps';
import axiosClient from '../axios';
import router from '../router';
import LoadingBar from '../components/LoadingBar.vue';

const userStore = useUserStore()

const mapStore = useMapStore()

const { mapSet, tpTierMap, proTierMap, tpMapsCount, proMapsCount } = storeToRefs(mapStore)

const { fetchMaps, getDistribution } = mapStore

const route = useRoute()

const unknownUser = ref(false)

const idInput = ref(null)

const loading = ref(true)

const info = ref(null)

const steamUser = ref(null)

const tpCompletions = ref(null)
const proCompletions = ref(null)

const tpRuns = ref([])
const proRuns = ref([])


watch(() => route.params.steamid, async () => {
	loading.value = true
	try {
		await getStats()
	} catch (error) {
		console.log(error)
	} finally {
		loading.value = false
	}
})

onMounted(async () => {
	loading.value = true

	try {
		await fetchSteamUser(route.params.steamid)

		await fetchMaps()

		await getDistribution()

		await getStats()

	} catch (error) {
		console.log(error)
	} finally {
		loading.value = false
	}

})

async function fetchSteamUser(steamid) {
	try {
		const result = await axiosClient.get(`/users/steamuser?steamid=${steamid}`)

		steamUser.value = result.data.response.players[0]

	} catch (error) {
		console.log(error)
	}
}

async function getStats() {

	try {

		const steamid = new SteamID(route.params.steamid).getSteamID64()


		// check if valid player
		const sid = new SteamID(steamid).getSteam2RenderedID();
		const playerData = await axios.get(`${globalApiBaseUrl}/players/steamid/${sid}`);
		const player = playerData.data[0];

		if (player.total_records === 0 && (player.name === 'Unknown' || player.name === 'Bad Steamid64')) {

			unknownUser.value = true

			return
		}

		tpRuns.value = await getCleanRuns(true, steamid)
		proRuns.value = await getCleanRuns(false, steamid)

		tpCompletions.value = await getCompletions(true, steamid)
		proCompletions.value = await getCompletions(false, steamid)


		// info
		let total = tpCompletions.value.pointsTotal + proCompletions.value.pointsTotal

		let recordCount = tpCompletions.value.recordCount + proCompletions.value.recordCount

		info.value = {
			pointsTotal: total,
			pointsAvg: recordCount === 0 ? 0 : Math.round(total / recordCount),
			name: player.name
		}

		for (let i = levels.length - 1; i >= 0; i--) {
			if (total >= levels[i].points && (i === levels.length - 1 || total < levels[i + 1].points)) {
				info.value.rank = levels[i].rank
				info.value.color = levels[i].color
			}
		}

	} catch (err) {
		console.log(err);
	}
}


async function getCompletions(has_teleports, steamid) {

	let recordCount = 0
	let pointsTotal = 0
	let pointsAvg = 0
	let wrCount = 0
	let _pt900 = 0
	let _pt800 = 0

	let completions = [
		{ tier: 1, completed: 0, pointsTotal: 0, pointsAvg: 0 },
		{ tier: 2, completed: 0, pointsTotal: 0, pointsAvg: 0 },
		{ tier: 3, completed: 0, pointsTotal: 0, pointsAvg: 0 },
		{ tier: 4, completed: 0, pointsTotal: 0, pointsAvg: 0 },
		{ tier: 5, completed: 0, pointsTotal: 0, pointsAvg: 0 },
		{ tier: 6, completed: 0, pointsTotal: 0, pointsAvg: 0 },
		{ tier: 7, completed: 0, pointsTotal: 0, pointsAvg: 0 },
		{ tier: 8, completed: 0, pointsTotal: 0, pointsAvg: 0 },
	]


	// fetch wrs from server to calculate wrs more accurately
	const wrData = await axiosClient.get(`/wrs/player?steamid64=${steamid}&has_teleports=${has_teleports}`, { headers: { 'Cache-Control': 'no-cache' } })

	wrCount = wrData.data.length

	// filter tp or pro runs
	const records = has_teleports ? tpRuns.value : proRuns.value


	// calculation
	for (const record of records) {
		// count out t9 maps
		if (!has_teleports && record.proTier === 9) continue

		recordCount++;
		pointsTotal += record.points;
		_pt900 += record.points > 900 ? 1 : 0;
		_pt800 += record.points > 800 ? 1 : 0;

		let index = has_teleports ? record.tpTier - 1 : record.proTier - 1

		completions[index].completed++;
		completions[index].pointsTotal += record.points;
	}

	for (const c of completions) {
		c.pointsAvg = c.completed === 0 ? 0 : Math.round(c.pointsTotal / c.completed)
	}

	pointsAvg = recordCount === 0 ? 0 : Math.round(pointsTotal / recordCount)

	return {
		recordCount,
		mapsTotal: has_teleports ? tpMapsCount.value : proMapsCount.value,
		wrCount,
		pt900: _pt900 - wrCount,
		pt800: _pt800 - _pt900,
		pointsTotal,
		pointsAvg,
		completions
	}
}


async function getCleanRuns(has_teleports, steamid) {
	// personal completions
	let result = await axios.get(`${globalApiBaseUrl}/records/top?steamid64=${steamid}&stage=0&modes_list_string=kz_vanilla&limit=10000&has_teleports=${has_teleports}`)


	// api returns several runs on one map, remove duplicates
	const map = new Map()
	for (const record of result.data) {
		// if db has this map(globalled)
		if (mapSet.value.has(record.map_id)) {
			if (!map.has(record.map_id)) {

				record.tpTier = tpTierMap.value.get(record.map_id)
				record.proTier = proTierMap.value.get(record.map_id)
				map.set(record.map_id, record)

			}
			// just ignore the old records, because they come late in the iteration
		}
	}

	// sort by date and pass it to RecordView
	return Array.from(map.values()).sort((a, b) => {
		if (a.updated_on > b.updated_on) {
			// negative is before
			return -1;
		}
		if (a.updated_on < b.updated_on) {
			return 1;
		}
		return 0;
	})
}

function loadStats() {
	const sid = new SteamID(idInput.value)

	if (sid.isValidIndividual()) {
		userStore.steamid = sid.getSteamID64()

		idInput.value = ''
		
		router.replace({
			name: 'stats',
			params: {
				steamid: userStore.steamid
			}
		})
	}
}

userStore.$subscribe(async (mutation, state) => {
	localStorage.setItem('steamid', state.steamid)
})


// await getDistribution()

// await getStats()

</script>



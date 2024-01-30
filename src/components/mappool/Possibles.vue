<template>
	<div>

		<div v-if="loading">
			<LoadingBar />
		</div>

		<div v-else class="flex flex-col sm:flex-row">
			<div class="flex flex-col sm:border-r sm:border-black dark:border-slate-600 items-center">
				<!-- tier selectors -->
				<div @click="currentTier = -1; offset = 0" :class="currentTier === -1 ? 'bg-slate-100 dark:bg-gray-500' : ''"
					class="text-2xl text-gray-800 dark:text-slate-200 font-semibold w-full px-10 py-2 text-center border-b border-black dark:border-slate-600 cursor-pointer">
					All Maps</div>
				<div
					class="text-xl italic text-slate-400 dark:text-slate-400 font-medium w-full px-10 py-2 text-center border-b border-black dark:border-slate-600">
					VNL Tiers</div>
				<div @click="currentTier = tier; offset = 0" v-for="tier in 8" :style="{ color: tierColors[tier - 1] }"
					:class="currentTier === tier ? 'bg-slate-100 dark:bg-gray-500' : ''"
					class="flex items-center gap-4 text-2xl font-semibold w-full px-10 py-2 text-center border-b border-black dark:border-slate-600 cursor-pointer">
					<div class="relative group">
						<i class="fa-solid fa-circle-info text-slate-700 dark:text-slate-200 text-base"></i>
						<p
							class="absolute invisible group-hover:visible p-1 top-10 text-base text-black border border-black bg-neutral-200 w-[250px] rounded-md">
							{{ tierNotes[tier - 1] }}</p>
					</div>
					<p>{{ tier }}</p>
					<p>
						{{ tierPhrases[tier - 1] }}
					</p>
				</div>
			</div>
			<!-- maps -->
			<div class="flex flex-col flex-1">
				<!-- sorting -->
				<div
					class="flex flex-col sm:flex-row items-center gap-4 sm:gap-2 px-3 sm:pl-8 py-2 border-b border-black dark:border-slate-600">
					<div class="flex gap-2 sm:gap-8 items-baseline">
						<!-- <p class="text-gray-400 px-6">order</p> -->
						<div @click="sortBy('name')" class="flex items-baseline cursor-pointer">
							<div class="text-xl font-medium cursor-pointer pr-1">Name</div>
							<div class="hidden sm:block text-gray-400">A-Z</div>
						</div>
						<div @click="sortBy('tpWr')" class="flex items-baseline cursor-pointer">
							<p class="text-xl text-yellow-600 pr-1">WR</p>
							<p class="hidden sm:block text-gray-400">tp</p>
						</div>
						<div @click="sortBy('proWr')" class="flex items-baseline cursor-pointer">
							<p class="text-xl text-blue-600 pr-1">WR</p>
							<p class="hidden sm:block text-gray-400">pro</p>
						</div>

						<!-- date picker -->
						<div class="flex items-center">
							<p @click="getMapsThisMonth()" class="text-xl text-purple-500 pr-1 cursor-pointer">Release</p>
							<!-- <i class="fa-solid fa-caret-down"></i> -->
							<div class="flex gap-2 items-center bg-yellow-50 dark:bg-gray-800 px-2 rounded-md">
								<!-- <p class="cursor-pointer">All</p> -->
								<div class="flex flex-col items-center">
									<i v-if="currentMonth" @click="monthChange(true)" class="fa-solid fa-caret-up cursor-pointer"></i>
									<p class="leading-4">{{ currentMonth ? months[currentMonth - 1] : '-' }}</p>
									<i v-if="currentMonth" @click="monthChange(false)" class="fa-solid fa-caret-down cursor-pointer"></i>
								</div>
								<div class="flex flex-col items-center">
									<i v-if="currentYear" @click="yearChange(true)" class="fa-solid fa-caret-up cursor-pointer"></i>
									<p class="leading-4">{{ currentYear || '-' }}</p>
									<i v-if="currentYear" @click="yearChange(false)" class="fa-solid fa-caret-down cursor-pointer"></i>
								</div>

								<button v-if="currentYear && currentMonth" @click="clearDate()"
									class="border border-slate-400 rounded-md bg-slate-100 dark:bg-gray-600 px-1">
									clear
								</button>
							</div>
						</div>
					</div>

					<!-- search -->
					<div>
						<input v-model="searchQuery" @input="getSearchResults()"
							class="bg-transparent border-b border-black dark:border-slate-600 outline-none text-center text-xl"
							type="text" placeholder="Search">
					</div>

				</div>

				<!-- pagination -->
				<div class="flex sticky top-[38px] bg-stats-primary dark:bg-gray-900 z-10 justify-center border-b border-black dark:border-slate-600 py-3">
					<div class="flex gap-4">
						<div @click="goPrevious()"
							class="flex items-center bg-gray-200 dark:bg-gray-600 px-2 rounded-sm cursor-pointer">
							<i class="fa-solid fa-angle-left"></i>
						</div>

						<div class="flex gap-1 font-semibold text-xl">
							<p>{{ offset + 1 }}</p>
							<p>/</p>
							<p>{{ total }}</p>
						</div>

						<div @click="goNext()" class="flex items-center bg-gray-200 dark:bg-gray-600 px-2 rounded-sm cursor-pointer">
							<i class="fa-solid fa-angle-right"></i>
						</div>
					</div>
				</div>


				<!-- map list -->
				<div class="flex flex-wrap justify-center gap-6 my-6 mx-8">
					<!-- TODO: highlight finished maps? -->
					<RouterLink :to="{ name: 'map', params: { mapname: map.name } }" v-for="map in maps"
						:key="map.id">
						<MapCard :map="map" />
					</RouterLink>
				</div>

			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import LoadingBar from '../../components/LoadingBar.vue';
import MapCard from '../../components/mappool/MapCard.vue';
import { tierColors, tierPhrases, tierNotes } from '../../constants';
import useMapStore from '../../store/maps';

const mapStore = useMapStore()

const { fetchMaps, fetchWrs } = mapStore


const loading = ref(true)

const currentTier = ref(-1)

const searchQuery = ref(null)
const queryTimeout = ref(null)
const mapSearch = ref(null)

const page = ref(20)
const offset = ref(0)
const total = ref(0)

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
const currentYear = ref(null)
const currentMonth = ref(null)

const sortColumn = ref(null)

const desc = ref(false)

let current_column = ''

onMounted(async () => {
	loading.value = true
	try {
		await fetchMaps()
		await fetchWrs()
	} catch (error) {
		console.log(error)
	} finally {
		loading.value = false
	}
})

const maps = computed(() => {

	let mapsToFilter = mapStore.maps

	if (currentTier.value > 0) {

		mapsToFilter = mapsToFilter.filter(map => map.tpTier === currentTier.value)

	}

	if (mapSearch.value) {

		let pattern = new RegExp(mapSearch.value)

		mapsToFilter = mapsToFilter.filter(map => pattern.test(map.name))

	}

	if (currentMonth.value && currentYear.value) {
		mapsToFilter = mapsToFilter.filter(map => {
			return currentYear.value === +(map.releaseDate.slice(0, 4)) && currentMonth.value === +(map.releaseDate.slice(5, 7))
		})
	}

	return paginate(getSortedMaps(sortColumn.value, desc.value, mapsToFilter))
})

function paginate(maps) {
	total.value = Math.ceil(maps.length / page.value)

	return maps.slice(offset.value * page.value, offset.value * page.value + page.value)
}

function goNext() {
	if (offset.value < total.value - 1) {
		offset.value++
	}
}

function goPrevious() {
	if (offset.value > 0) {
		offset.value--
	}
}

function sortBy(column) {

	sortColumn.value = column

	offset.value = 0

	if (column === current_column) {
		desc.value = !desc.value
	} else {
		current_column = column
	}
}

function getSortedMaps(column, desc, maps) {

	if (!column) return maps

	if (column === 'name' || column === 'releaseDate') {
		return maps.sort((a, b) => {
			if (a[column] > b[column]) {
				return desc ? 1 : -1;
			}
			if (a[column] < b[column]) {
				return desc ? -1 : 1;
			}
			return 0;
		})
	}
	if (column === 'tpWr' || column === 'proWr') {
		return maps.sort((a, b) => {
			return desc ? a[column] - b[column] : b[column] - a[column];
		})
	}
}

function getSearchResults() {
	clearTimeout(queryTimeout.value)

	queryTimeout.value = setTimeout(() => {
		mapSearch.value = searchQuery.value
	}, 300)
}


function monthChange(increment) {
	if (increment) {
		if (currentMonth.value + 1 > 12) {
			currentYear.value++
			currentMonth.value = 1
			return
		}
		currentMonth.value++
	} else {
		if (currentMonth.value - 1 <= 0) {
			currentYear.value--
			currentMonth.value = 12
			return
		}
		currentMonth.value--
	}
}

function yearChange(increment) {
	if (increment) currentYear.value++
	else currentYear.value--
}


function getMapsThisMonth() {
	const now = new Date()

	currentMonth.value = now.getMonth() + 1
	currentYear.value = now.getFullYear()
}

function clearDate() {
	currentMonth.value = null
	currentYear.value = null
}

</script>
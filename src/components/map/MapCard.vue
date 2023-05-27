<template>
	<!-- map section -->
	<div class="flex flex-col sm:border-r sm:border-black dark:border-slate-600 sm:min-h-screen">
		<!-- map box -->
		<div class="flex flex-col items-center pb-2 px-4 border-b border-black dark:border-slate-600">

			<img class="h-[220px] w-[390px] border border-slate-400 rounded-sm mt-4"
				:src="'https://raw.githubusercontent.com/KZGlobalTeam/map-images/public/mediums/' + map.name + '.jpg'"
				onerror="this.onerror = null; this.src = '/loading.jpg'">

			<div class="text-3xl font-semibold mt-2">{{ map.name }}</div>

			<div class="flex gap-2 text-xl mt-1">

				<p class="text-gray-500">by</p>

				<!-- TODO more mappers -->
				<div class="flex gap-2">
					<p v-for="(mapper, index) in map.mapperNames" class="italic">{{ mapper + (index !== map.mapperNames.length - 1 ?
						', '
						: '') }}</p>
				</div>

			</div>

			<div class="flex gap-6 mt-1">
				<div class="flex gap-2">
					<p
						class="flex items-center border border-slate-400 dark:border-slate-600 bg-yellow-400 dark:bg-yellow-600 px-2 rounded-md">
						{{ map.tpTier }}
					</p>
					<p :style="{ color: tierColors[map.tpTier - 1] }" class="text-2xl">{{ tierPhrases[map.tpTier - 1] }}</p>
				</div>

				<div class="flex gap-2">
					<p
						class="flex items-center border border-slate-400 dark:border-slate-600 bg-blue-400 dark:bg-blue-600 px-2 rounded-md">
						{{ map.proTier }}
					</p>
					<p :style="{ color: tierColors[map.proTier - 1] }" class="text-2xl">
						{{ map.proTier > 8 ? 'Unfeasible' : tierPhrases[map.proTier - 1] }}
					</p>
				</div>
			</div>

		</div>

		<div class="flex justify-center items-center border-b border-black dark:border-slate-600 py-2 text-xl">
			<p
				class="self-start border border-slate-400 dark:border-slate-600 dark:bg-gray-700 bg-gray-300 px-1 rounded-md mr-4">
				PB</p>
			<p :class="pbTp ? 'text-yellow-600' : ''">{{ pbTp ? formatTime(pbTp) : 'none' }}</p>
			<p class="px-2 text-gray-400">/</p>
			<p :class="pbPro ? 'text-blue-600' : ''">{{ pbPro ? formatTime(pbPro) : 'none' }}</p>
		</div>
		<!-- notes -->
		<div class="flex flex-col items-center pt-3 pb-5 border-b border-black dark:border-slate-600">
			<div class="flex items-baseline gap-2 text-xl">
				<i class="fa-regular fa-pen-to-square"></i>
				<p class="font-medium">About this map</p>
				<p class="text-gray-400 text-sm">from GMC</p>
			</div>
			<p v-html="map.notes" class="map-notes max-w-[400px] px-1 mt-2">
			</p>
		</div>
		<!-- bonus -->
		<div class="flex flex-col border-b items-center border-black dark:border-slate-600 py-2">
			<p class="text-xl font-medium mb-1">Possible Courses</p>
			<div class="flex flex-wrap justify-center gap-2 max-w-[400px] mb-1">
				<p @click="toggleStage(0); selectedBonus = null" :class="selectedStage === 0 ? 'text-green-600' : ''"
					class="text-base px-1 border border-slate-400 dark:border-slate-600 rounded-md bg-gray-700 cursor-pointer italic">
					Main
				</p>
				<p @click="toggleStage(bonus.bonus_number); selectedBonus = bonus" v-for="bonus in bonuses" :key="bonus.id"
					:class="selectedStage === bonus.bonus_number ? 'text-green-600' : ''"
					class="text-base w-[25px] text-center border border-slate-400 dark:border-slate-600 rounded-md bg-gray-700 cursor-pointer italic">
					{{ bonus.bonus_number }}
				</p>
			</div>
			<p v-if="selectedBonus" class="max-w-[400px]">{{ selectedBonus.notes }}</p>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import { toRefs } from '@vueuse/core'
import { tierPhrases, tierColors } from '../../constants';
import formatTime from '../../time';

const props = defineProps({
	map: {
		type: Object,
		default: null
	},
	pbTp: {
		type: Number,
		default: null
	},
	pbPro: {
		type: Number,
		required: true
	},
	bonuses: {
		type: Array,
		default: []
	}
})

const emits = defineEmits(['toggleStage'])

const { map, pbTp, pbPro, bonuses } = toRefs(props)

const selectedStage = ref(0)
const selectedBonus = ref(null)

function toggleStage(stage) {
	selectedStage.value = stage
	emits('toggleStage', stage)
}


</script>

<style scoped>
.map-notes:deep() iframe {
	width: 380px;
	height: 212px;
}
</style>
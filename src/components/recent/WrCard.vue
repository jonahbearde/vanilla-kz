<template>
	<div class="flex flex-col items-center px-1 my-2 bg-yellow-50 dark:bg-slate-800 border border-slate-600 rounded-md">
		<p :style="{ color: mapColor }" class="text-xl font-medium cursor-pointer max-w-[260px] truncate">
			{{ wr.map_name }}
		</p>
		<div class="relative">
			<RouterLink :to="{ name: 'map', params: { mapname: wr.map_name } }" target="_blank">
				<img :src="imageApiPrefix + wr.map_name + '.jpg'" loading="lazy"
					onerror="this.onerror = null; this.src = '/loading.jpg'" class="h-[150px] w-auto rounded-md cursor-pointer" />
			</RouterLink>
			<p :style="{ color: mapColor }"
				class="absolute top-1 right-1 text-lg font-semibold leading-6 px-1 bg-slate-300 dark:bg-gray-800 border border-slate-600 rounded-sm">
				{{ tpTierMap.get(wr.map_id) }}</p>
		</div>

		<div class="flex flex-col items-center w-full">
			<div class="flex justify-center gap-2 items-baseline">
				<RouterLink :to="{ name: 'stats', params: { steamid: wr.steamid64 } }" target="_blank"
					class="font-medium text-cyan-400 cursor-pointer text-lg max-w-[150px] truncate">{{ wr.player_name }}
				</RouterLink>
				<p :class="wr.teleports > 0 ? 'text-yellow-600' : 'text-blue-600'" class="text-base">{{ formatTime(wr.time) }}</p>
			</div>
			<div class="flex items-center gap-2 text-sm">
				<p v-if="props.showPlace">{{ '#' + wr.place }}</p>
				<p class="italic">{{ humanTime(wr.updated_on) }}</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed } from 'vue'
import { toRefs } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { formatDistanceStrict } from 'date-fns'
import { imageApiPrefix, tierColors } from '../../constants'
import formatTime from '../../time'
import useMapStore from '../../store/maps';


const mapStore = useMapStore()


const { tpTierMap, proTierMap } = storeToRefs(mapStore)

const props = defineProps({
	wr: {
		type: Object,
		required: true
	},
	has_teleports: {
		type: Boolean,
		required: true
	},
	showPlace: {
		type: Boolean,
		default: false
	}
})

const mapColor = computed(() => {
	let id = props.wr.map_id
	let tier = props.has_teleports ? tpTierMap.value.get(id) : proTierMap.value.get(id)
	return tierColors[tier - 1]
})

const { wr } = toRefs(props)


function humanTime(updated_on) {
	let distance = formatDistanceStrict(Date.now(), new Date(updated_on))

	return distance + ' ago'
}

</script>
<template>
	<div class="flex flex-col items-center">
		<div class="flex items-center gap-3 mb-2">
			<p class="text-xl">{{ completions.recordCount + '/' + completions.mapsTotal }}</p>
			<p class="text-xl">{{ completions.pointsTotal + 'pts' }}</p>
			<p class="text-xl">{{ completions.pointsAvg + 'avg' }}</p>
		</div>
		<!-- medals -->
		<div class="flex gap-3 items-center mb-2 text-xl">
			<div class="flex">
				<span class="tooltip" style="color: #f9ca24">
					<span class="tooltiptext">WRs</span>
					<i class="fa-solid fa-medal"></i>
				</span>
				<p>{{ completions.wrCount }}</p>
			</div>
			<div class="flex">
				<span class="tooltip" style="color: #b2bec3">
					<span class="tooltiptext">900+</span>
					<i class="fa-solid fa-medal"></i>
				</span>
				<p>{{ completions.pt900 }}</p>
			</div>
			<div class="flex">
				<span class="tooltip" style="color: #EAB543">
					<span class="tooltiptext">800+</span>
					<i class="fa-solid fa-medal"></i>
				</span>
				<p>{{ completions.pt800 }}</p>
			</div>
		</div>

		<!-- progress on each tier -->
		<div class="flex flex-col gap-1 text-xl">
			<div v-for="(completion, index) in completions.completions" :key="completion.tier"
				class="flex flex-row items-center gap-1">
				<p class="w-[75px]">{{ completion.completed }}/{{ isTp ? tpDistribution[index] : proDistribution[index] }}</p>
				<div class="h-6 w-52 rounded-md bg-gray-200 dark:bg-gray-600">
					<div
						:style="{ width: (13 * (completion.completed) / (isTp ? tpDistribution[index] : proDistribution[index])) + 'rem', background: tierColors[index] }"
						class="h-6 rounded-md text-center text-black"></div>
				</div>
				<p>{{ completion.pointsAvg + 'avg' }}</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { toRefs } from '@vueuse/core'
import { storeToRefs } from 'pinia';
import useMapStore from '../../store/maps';
import { tierColors } from '../../constants';

const mapStore = useMapStore()

const { tpDistribution, proDistribution } = storeToRefs(mapStore)

const props = defineProps({
	completions: {
		type: Object,
		required: true
	},
	isTp: {
		type: Boolean,
		required: true
	}
})

const { completions, isTp } = toRefs(props)
</script>

<style scoped>
.tooltip {
	position: relative;
}

.tooltip .tooltiptext {
	position: absolute;
	bottom: 20px;
	right: 10px;
	visibility: hidden;
	border: 1px solid slategray;
	border-radius: 5px;
	background-color: #f7f1e3;
	color: slategray;
	padding: 0 5px;
	z-index: 1;
}

.tooltip:hover .tooltiptext {
	visibility: visible;
}
</style>
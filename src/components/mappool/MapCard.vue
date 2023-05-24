<template>
	<div class="flex flex-col items-center rounded-sm" :style="{ 'border': '2px solid' + tierColors[map.tpTier - 1] }">
		<p>{{ map.name }}</p>
		<div class="relative">
			<img :src="'https://raw.githubusercontent.com/KZGlobalTeam/map-images/public/mediums/' + map.name + '.jpg'"
				loading="lazy" onerror="this.onerror = null; this.src = '/loading.jpg'"
				class="h-[148px] w-[256px] fade-in cursor-pointer border-y border-black dark:border-slate-600">
			<p :style="{ color: tierColors[map.tpTier - 1] }"
				class="absolute bottom-[115px] left-[228px] text-lg font-semibold leading-6 px-1 bg-slate-300 dark:bg-gray-800 border border-slate-600 rounded-sm">
				{{ map.tpTier }}</p>
		</div>

		<div class="grid grid-cols-[2fr_20px_3fr] w-full border-b border-black dark:border-slate-600">
			<p class="justify-self-end text-yellow-600">TP</p>
			<p class="justify-self-center">-</p>
			<p class="justify-self-start text-yellow-600">{{ map.tpWr !== 999999.0 ? formatTime(map.tpWr) : 'none' }}</p>
		</div>

		<div class="grid grid-cols-[2fr_20px_3fr] w-full">
			<p class="justify-self-end text-blue-600">PRO</p>
			<p class="justify-self-center">-</p>
			<p class="justify-self-start text-blue-600">{{ map.proWr !== 999999.0 ? formatTime(map.proWr) : 'none' }}</p>
		</div>

	</div>
</template>

<script setup>
import { toRefs } from 'vue'
import { tierColors } from '../../constants';
import formatTime from '../../time';

const props = defineProps({
	map: {
		type: Object,
		required: true
	}
})

const { map } = toRefs(props)


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
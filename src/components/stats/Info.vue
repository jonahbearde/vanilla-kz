<template>
	<div>
		<div v-if="props.unknown">
			<p class="text-3xl font-semibold text-gray-500 ml-8">NO RECORD</p>
		</div>
		<div v-else class="flex flex-col sm:flex-row gap-2 sm:gap-6 items-center">
			<!-- TODO show avatar? -->
			<a :href="props.steamUser.profileurl" target="_blank">
				<img :src="props.steamUser.avatar" class="w-[60px] h-auto border-2 border-slate-400 dark:border-black rounded-sm sm:ml-6">
			</a>
			<p class="text-3xl text-[#00b894] font-bold">{{ info?.name }}</p>
			<img v-if="props.steamUser.loccountrycode" :src="'https://flagcdn.com/28x21/' + props.steamUser.loccountrycode.toLowerCase() + '.png'">
			<p :style="{ color: info?.color }" class="text-2xl font-semibold">{{ info?.rank }}
			</p>
			<div class="flex gap-4 text-xl">
				<p>{{ info?.pointsTotal + 'pts' }}</p>
				<p>{{ info?.pointsAvg + 'avg' }}</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { toRefs } from '@vueuse/core';

const props = defineProps({
	info: {
		type: Object,
		default: null
	},
	unknown: {
		type: Boolean,
		required: true
	},
	steamUser: {
		type: Object,
		required: true
	}
})

const { info } = toRefs(props)	
</script>
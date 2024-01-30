<template>
	<!-- records -->
	<div class="w-[700px] sm:w-full sm:overflow-hidden">

		<div class="grid grid-cols-11 font-semibold border-b border-slate-400">
			<p class="col-span-1 pl-1">#</p>
			<p class="col-span-3">Name</p>
			<p class="col-span-2">Time</p>
			<p class="col-span-2">Points</p>
			<p class="col-span-3">Date</p>
		</div>

		<div v-for="(run, index) in runs" :key="run.id"
			class="grid grid-cols-11 py-1 border-b border-slate-300 dark:border-slate-600"
			:class="run.steamid64 === userStore.steamid ? 'dark:bg-gray-600 bg-white' : ''">
	
			<div class="col-span-1 relative">
				<p class="pl-1">{{ index + 1 }}</p>
				<div class="absolute left-6 top-0">
					<i v-if="index === 0" class="text-[#f9ca24] fa-solid fa-medal"></i>
					<i v-if="index === 1" class="text-[#b2bec3] fa-solid fa-medal"></i>
					<i v-if="index === 2" class="text-[#EAB543] fa-solid fa-medal"></i>
				</div>
			</div>

			<RouterLink :to="{ name: 'stats', params: { steamid: run.steamid64 } }" class="col-span-3 font-normal cursor-pointer text-green-600 truncate">
				{{ run.player_name }}
			</RouterLink>

			<p :class="props.has_teleports ? 'text-yellow-600' : 'text-blue-600'" class="col-span-2">{{ formatTime(run.time) }}</p>
			<p class="col-span-2">{{ run.points }}</p>
			<p class="col-span-3 italic">
				{{ localDate(run.updated_on) }}
			</p>
		</div>

	</div>
</template>

<script setup>
import { toRefs } from 'vue'
import formatTime from '../../time'
import localDate from '../../date'
import { RouterLink } from 'vue-router';
import useUserStore from '../../store/user';


const userStore = useUserStore()

const props = defineProps({
	runs: {
		type: Array,
		required: true
	},
	has_teleports: {
		type: Boolean,
		required: true
	}
})

const { runs } = toRefs(props)
</script>
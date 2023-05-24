<template>
	<div>

		<div
			class="flex items-center justify-center gap-2 sm:gap-16 py-2 px-1 text-xl font-medium border-b border-black dark:border-slate-600">
			<div @click="switchTab('points')" :class="selectedTab === 'points' ? 'text-green-600' : ''"
				class="border border-slate-600 rounded-md px-2 bg-gray-50 dark:bg-gray-600 cursor-pointer">
				Points
			</div>
			<div @click="switchTab('wrs')" :class="selectedTab === 'wrs' ? 'text-green-600' : ''"
				class="border border-slate-600 rounded-md px-2 bg-gray-50 dark:bg-gray-600 cursor-pointer">
				World Records
			</div>
			<div @click="switchTab('bonuses')" :class="selectedTab === 'bonuses' ? 'text-green-600' : ''"
				class="border border-slate-600 rounded-md px-2 bg-gray-50 dark:bg-gray-600 cursor-pointer">
				Bonuses
			</div>
		</div>

		<Suspense>
			<component :is="selected"></component>
		</Suspense>
	</div>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import WrRanking from '../components/leaderboards/WrRanking.vue';
import BonusRanking from '../components/leaderboards/BonusRanking.vue'
import PointRanking from '../components/leaderboards/PointRanking.vue';

const selected = shallowRef(WrRanking)

const selectedTab = ref('wrs')

function switchTab(tab) {
	selectedTab.value = tab
	switch (tab) {
		case 'points':
			selected.value = PointRanking
			break
		case 'wrs':
			selected.value = WrRanking
			break
		case 'bonuses':
			selected.value = BonusRanking
			break
		default: break
	}
}


</script>
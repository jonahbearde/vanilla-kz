<template>
	<div class="flex flex-col items-center">
		<div
			class="flex items-center gap-2 text-3xl mt-10 border border-slate-400 rounded-md shadow-sm max-w-[350px] sm:max-w-[500px] mx-4 p-2">
			<form @submit.prevent="loadStats()">
				<input v-model="idInput" type="text" placeholder="Steam ID or 64"
					class="text-slate-400 bg-transparent outline-none h-[50px]">
			</form>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SteamID from 'steamid';
import useUserStore from '../store/user';

const userStore = useUserStore()

const router = useRouter()

const idInput = ref('')

function loadStats() {
	const sid = new SteamID(idInput.value);

	if (sid.isValidIndividual()) {
		userStore.steamid = sid.getSteamID64()
		
		router.push({
			name: 'stats',
			params: {
				steamid: userStore.steamid
			}
		})
	}
}

userStore.$subscribe((mutation, state) => {
	localStorage.setItem('steamid', state.steamid)
})

</script>
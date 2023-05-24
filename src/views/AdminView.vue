<template>
	<div class="flex bg-white text-black">
		<!-- sidebar -->
		<div class="flex flex-col items-center border-r border-black min-h-screen">
			<div class="flex gap-2 items-center justify-center w-full p-4 text-xl border-b border-black">
				<p>{{ user.name }}</p>
				<i @click="logout" class="fa-solid fa-arrow-right-from-bracket cursor-pointer"></i>
			</div>
			<RouterLink to="/" class="text-2xl w-full border-b border-black text-center p-4 cursor-pointer">Home</RouterLink>
			<div @click="switchTab(0)" class="text-2xl w-full border-b border-black text-center p-4 cursor-pointer">Possible
				Maps</div>
			<div @click="switchTab(1)" class="text-2xl w-full border-b border-black text-center p-4 cursor-pointer">Uncompleted
				Maps</div>
			<div @click="switchTab(2)" class="text-2xl w-full border-b border-black text-center p-4 cursor-pointer">Bonuses
			</div>
			<div @click="switchTab(3)" class="text-2xl w-full border-b border-black text-center p-4 cursor-pointer">Posts
			</div>
			<div @click="switchTab(4)" class="text-2xl w-full border-b border-black text-center p-4 cursor-pointer">Resources
			</div>
		</div>
		<!-- data -->
		<KeepAlive>
			<Suspense>
				<component :is="currentTab" />
				<template #fallback>
					<LoadingBar />
				</template>
			</Suspense>
		</KeepAlive>
	</div>
</template>

<script setup>
import { shallowRef } from 'vue';
import { useStorage } from '@vueuse/core';
import { useRouter } from 'vue-router';
import PossibleMaps from '../components/admin/PossibleMaps.vue';
import UncompletedMaps from '../components/admin/UncompletedMaps.vue';
import Bonuses from '../components/admin/Bonuses.vue';
import Posts from '../components/admin/Posts.vue';
import Resources from '../components/admin/Resources.vue'
import LoadingBar from '../components/LoadingBar.vue';

const router = useRouter();

const user = useStorage('user', { token: '', id: -1, name: '', role: '' });

const tabs = [PossibleMaps, UncompletedMaps, Bonuses, Posts, Resources];

const currentTab = shallowRef(PossibleMaps);

const switchTab = (index) => {
	currentTab.value = tabs[index];
}

const logout = () => {
	const visitor = {
		token: '',
		id: -1,
		name: '',
		role: ''
	};
	const user = useStorage('user', visitor);
	user.value = visitor;
	router.push('login');
}

</script>
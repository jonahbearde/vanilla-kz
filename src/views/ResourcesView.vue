<template>
	<div>
		<div v-if="loading">
			<LoadingBar />
		</div>

		<div v-else class="flex flex-col sm:flex-row justify-center py-8 gap-10 px-2">
			<div class="w-[360px] sm:w-[600px]">
				<h1 class="text-3xl font-semibold border-b border-black dark:border-slate-200">Vanilla KZ</h1>
				<div v-for="resource in vnlResources" :key="resource.id" class="flex flex-col gap-2">
					<h2 class="text-xl font-medium border-b border-slate-400 dark:border-slate-600 text-blue-400"><a
							:href="resource.link">{{ resource.name }}</a></h2>
					<div v-html="resource.desc" class="text-lg"></div>
				</div>
			</div>
			<div class="w-[360px] sm:w-[600px]">
				<h1 class="text-3xl font-semibold border-b border-black dark:border-slate-200">GOKZ</h1>
				<div v-for="resource in gokzResources" :key="resource.id" class="flex flex-col gap-2">
					<h2 class="text-xl font-medium border-b border-slate-400 dark:border-slate-600 text-green-400"><a
							:href="resource.link">{{ resource.name }}</a></h2>
					<div v-html="resource.desc" class="text-lg"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axiosClient from '../axios';
import LoadingBar from '../components/LoadingBar.vue';

const vnlResources = ref([])
const gokzResources = ref([])

const loading = ref(true)

onMounted(async () => {
	loading.value = true
	try {
		const results = await axiosClient.get(`/resources`)
		vnlResources.value = results.data.filter(resource => resource.category === 'VNL')
		gokzResources.value = results.data.filter(resource => resource.category === 'GOKZ')
	} catch (error) {
		console.log(error);
	} finally {
		loading.value = false
	}
})

</script>
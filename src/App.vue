<template>
	<div class="flex flex-col bg-stats-primary min-h-screen font-Lora dark:text-slate-300 dark:bg-gray-900">
		<NavBar />
		<Suspense>
			<RouterView />
		</Suspense>
	</div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';

</script>

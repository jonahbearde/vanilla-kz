<template>
	<div>
		<NavBar />
		<div class="w-[300px] sm:w-[700px] flex flex-col gap-4 mx-auto mt-20 border-2 border-slate-300 rounded-lg shadow-lg p-4 sm:p-8">
			<p class="text-xl">Hey, this is Reeed, the developer of vnl.kz. I hope you're enjoying exploring the website so far!</p>
			<p class="text-xl">If you have any suggestions or encounter any issues, please feel free to contact me, you can:</p>
			<ul class="text-xl list-disc list-inside">
				<li>message me through discord <span class="social dark:bg-gray-700">Reeed#1536</span></li>
				<li>mail me at <span class="social dark:bg-gray-700">bearinparadox@gmail.com</span></li>
				<li>or preferably, join <a class="social dark:bg-gray-700" href="https://discord.gg/xJXhMjHcGV" target="_blank">GMC</a>(Global Map Coverage) discord server</li>
			</ul>
			<p class="text-xl">Happy kreedzing!</p>
		</div>
	</div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue';
</script>

<style scoped>
.social {
	background-color: azure;
	font-style: italic;
	text-decoration: solid underline rgb(220 252 231) 4px;
}
</style>
<template>
	<div>

		<div
			class="flex items-center justify-center gap-2 sm:gap-16 py-2 sm:px-8 text-xl font-medium border-b border-black dark:border-slate-600">
			<RouterLink :to="{ name: 'possible' }" active-class="text-green-600"
				class="border border-slate-600 rounded-md px-2 bg-gray-50 dark:bg-gray-600">
				VNL Possible Maps
			</RouterLink>
			<RouterLink :to="{ name: 'unfeasible' }" active-class="text-green-600"
				class="border border-slate-600 rounded-md px-2 bg-gray-50 dark:bg-gray-600">
				Other Maps
			</RouterLink>
		</div>

		<Suspense>
			<RouterView />
		</Suspense>

	</div>
</template>

<script setup>


</script>
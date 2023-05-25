<template>
	<div class="flex flex-1 items-center justify-center dark:bg-slate-800">
		<div
			class="flex flex-col items-center  w-[300px] pt-8 pb-4 px-2 m-auto text-2xl rounded-md shadow-md border border-slate-400 dark:bg-gray-900">
			<form @submit.prevent="signin" class="flex flex-col items-center gap-4">
				<input v-model="username" type="text" placeholder="name"
					class="bg-transparent outline-none text-center border-b border-slate-400">
				<input v-model="password" type="password" placeholder="password"
					class="bg-transparent outline-none text-center border-b border-slate-400">
				<div v-if="loginError" class="text-red-400 text-base">{{ loginError }}</div>
				<button v-if="!loading" type="submit"
					class="w-max border-slate-400 border rounded-md p-1 cursor-pointer">Login</button>
				<Spinner v-else />
			</form>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import Spinner from './UI/Spinner.vue'
import useUserStore from '../store/user';

const userStore = useUserStore()

const { login } = userStore

const { user, loading } = storeToRefs(userStore)

const router = useRouter();

const username = ref('');
const password = ref('');

const loginError = ref('');

userStore.$subscribe((mutation, state) => {
	localStorage.setItem('user', JSON.stringify(state.user))
})

async function signin() {
	loginError.value = ''

	if (!username.value || !password.value) {
		loginError.value = 'name and password are required';
		return
	}

	try {
		const error = await login(username.value, password.value)

		if (error) {
			loginError.value = error.response.data.message
			return 
		}
		if (user.value.role === 'Admin' || user.value.role === 'Elon') {
			router.push('admin')
		} else {
			router.push('stats')
		}
	} catch (error) {
		console.log(error);
	}
}
</script>
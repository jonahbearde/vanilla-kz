<template>
	<div class="flex flex-1 dark:bg-slate-800 h-screen">
		<div
			class="flex flex-col items-center justify-center w-[300px] pt-8 pb-4 px-2 m-auto text-2xl rounded-md shadow-md border border-slate-400 dark:bg-gray-900">
			<form @submit.prevent="register" class="flex flex-col items-center gap-4">
				<input v-model="username" type="text" placeholder="name"
					class="bg-transparent outline-none text-center border-b border-slate-400">
				<input v-model="password" type="password" placeholder="password"
					class="bg-transparent outline-none text-center border-b border-slate-400">
				<div v-if="signupError" class="text-red-400 text-base">{{ signupError }}</div>
				<button v-if="!loading" type="submit" class="w-max border-slate-400 border rounded-md p-1 cursor-pointer">Sign
					Up</button>
				<Spinner v-else />
			</form>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import axiosClient from '../axios';
import Spinner from './UI/Spinner.vue';
import useUserStore from '../store/user';

const userStore = useUserStore()

const { signup } = userStore

const { loading } = storeToRefs(userStore)

const router = useRouter();


const username = ref('');
const password = ref('');


const signupError = ref('');

const register = async () => {
	signupError.value = '';

	const pattern = new RegExp('^[a-zA-Z][^\\s]+$');

	if (!username.value || !password.value) {
		signupError.value = 'name and password are required';
		return;
	}

	if (!pattern.test(username.value)) {
		signupError.value = 'the name must start with a letter and contain no spaces';
		return
	}

	try {
		const result = await axiosClient.get(`/users/${username.value}`)

		if (!result.data) {
			await signup(username.value, password.value)

			router.push('/')

		} else {
			signupError.value = 'this name is taken'
		}

	} catch (error) {
		console.log(error);

		signupError.value = error.response.data.message;
	}
}
</script>
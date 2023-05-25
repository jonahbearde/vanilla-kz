<template>
	<div
		class="nav-bar sticky w-full top-0 flex flex-row items-center py-1 border-b border-black dark:border-slate-600 bg-yellow-50 dark:bg-slate-900 z-20">
		<div class="logo flex items-center gap-1 text-xl ml-4 mr-4 sm:mr-10">
			<!-- <i class="fa-solid fa-person-running"></i> -->
			<img src="/logo-vnl.png" class="w-[30px] h-auto" alt="logo-vnl" />
			<p class="text-blue-600 vnl-text">Vanilla KZ</p>
		</div>
		<div class="nav-menu flex flex-col sm:flex-row items-center sm:gap-10 dark:bg-slate-900 text-xl font-medium">
			<RouterLink to="/recent" @click="closeMenu" class="nav-item dark:border-slate-600">Recent</RouterLink>
			<RouterLink to="/stats" @click="closeMenu" class="nav-item dark:border-slate-600">Stats</RouterLink>
			<RouterLink to="/maps" @click="closeMenu" class="nav-item dark:border-slate-600">Maps</RouterLink>
			<RouterLink to="/leaderboards" @click="closeMenu" class="nav-item dark:border-slate-600">Leaderboards
			</RouterLink>
			<RouterLink to="/resources" @click="closeMenu" class="nav-item dark:border-slate-600">Resources</RouterLink>
			<div class="cursor-pointer">
				<a href="https://docs.vnl.kz" target="_blank">Guides</a>
			</div>
			<RouterLink to="/about" @click="closeMenu" class="nav-item dark:border-slate-600">About</RouterLink>
		</div>

		<div v-if="user" class="flex flex-1 justify-end items-center gap-4 text-xl mr-4">
			<p>{{ user.name }}</p>
			<i @click="signout" class="fa-solid fa-arrow-right-from-bracket cursor-pointer"></i>
		</div>

		<div v-else class="flex flex-1 justify-end items-center gap-2 sm:gap-4 mr-4">
			<button @click="signup"
				class="w-max text-sm font-medium border border-slate-400 rounded-md bg-yellow-100 dark:bg-slate-600 dark:hover:bg-slate-400 hover:bg-yellow-200 px-2 cursor-pointer">
				Sign Up
			</button>
			<button @click="login"
				class="w-max text-sm font-medium border border-slate-400 rounded-md bg-yellow-100 dark:bg-slate-600 dark:hover:bg-slate-400 hover:bg-yellow-200 px-2 cursor-pointer">
				Log In
			</button>
		</div>

		<div @click="toggleDark()" class="text-xl cursor-pointer mr-4">
			<i v-if="isDark" class="fa-solid fa-sun"></i>
			<i v-else class="fa-sharp fa-solid fa-moon"></i>
		</div>


		<div @click="toggleMenu" class="hamburger hidden mr-2">
			<span class="bar dark:bg-slate-200"></span>
			<span class="bar dark:bg-slate-200"></span>
			<span class="bar dark:bg-slate-200"></span>
		</div>
	</div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import useUserStore from '../store/user'
import { storeToRefs } from 'pinia';

const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const { logout } = userStore

const isDark = useDark()
const toggleDark = useToggle(isDark)

const router = useRouter()


const toggleMenu = () => {
	const navMenu = document.querySelector('.nav-menu')
	navMenu.classList.toggle('active')
}

const closeMenu = () => {
	const navMenu = document.querySelector('.nav-menu')
	navMenu.classList.remove('active')
}


const signup = () => {
	router.push('/signup');
}

const login = () => {
	router.push('/login');
}

const signout = () => {
	logout()
	router.push('/login');
}

// watch for state changes
userStore.$subscribe((mutation, state) => {
	localStorage.setItem('user', JSON.stringify(state.user))
})

</script>

<style scoped>
.bar {
	display: block;
	width: 25px;
	height: 3px;
	margin: 5px auto;
	background-color: #101010;
}

@media only screen and (max-width: 640px) {
	.vnl-text {
		visibility: hidden;
	}

	.nav-menu {
		position: fixed;
		left: -100%;
		top: 2.5rem;
		margin-left: 0;
		padding-bottom: 5px;
		gap: 0;
		background-color: rgb(254 252 232);
		width: 100%;
		/* border-radius: 0 0 5px 5px; */
		text-align: center;
		transition: 0.3s;
		border-bottom: 1px solid slategray;
	}

	.nav-menu.active {
		left: 0;
	}

	.nav-item {
		margin: 5px 0;
		border-bottom: 1px solid black;
	}

	.hamburger {
		display: block;
		cursor: pointer;
	}
}
</style>
<template>
	<div
		class="news flex flex-col items-center py-8 px-4 gap-4 sm:border-r border-black dark:border-slate-600 overflow-auto">
		<p class="text-center text-3xl font-medium border-b border-slate-400 px-12 pb-2">VNL News Letter</p>
		<div>
			<div class="flex flex-wrap gap-6 items-center justify-center w-[360px] sm:w-[600px] text-xl">
				<div @click="selectedTag = tag" v-for="tag in tags" :key="tag" class="italic flex items-center cursor-pointer">
					<i class="fa-duotone fa-hashtag"></i>
					<p>{{ tag }}</p>
				</div>
			</div>
		</div>
		<!-- news card -->
		<div v-for="news in filteredNewsList" :key="news.id"
			class="flex flex-col items-start p-4 rounded-lg shadow-md bg-stats-secondary dark:bg-slate-800 w-[360px] sm:w-[600px]">
			<p @click="toggleCollapse(news.id)" class="text-2xl font-medium cursor-pointer">{{ news.header }}</p>
			<div class="flex flex-row gap-3 sm:gap-4 pt-2">
				<div class="flex gap-2 items-baseline">
					<i class="fa-regular fa-calendar-days"></i>
					<p>{{ news.updated_on.split('T')[0] }}</p>
				</div>
				<div class="hidden sm:flex gap-2 items-baseline">
					<i class="fa-solid fa-user"></i>
					<p>{{ news.published_by }}</p>
				</div>
				<div class="flex gap-1 items-baseline">
					<i class="fa-solid fa-hashtag"></i>
					<p class="italic">{{ news.tag }}</p>
				</div>
				<p></p>
			</div>
			<p class="news-content pt-4 text-base sm:text-lg" v-html="news.content"></p>
			<div class="pt-4 w-full">
				<div class="flex items-center gap-1 px-1">
					<i class="fa-regular fa-comment"></i>
					<p class="">{{ news.comments.length }}</p>
				</div>
				<form @submit.prevent="addComment(news.id)">
					<input type="text" v-model="commentToAdd"
						class="max-h-20 w-full text-start outline-none bg-yellow-100 dark:bg-black border border-slate-300 rounded-md p-1 my-1"
						placeholder="say something?">
				</form>
				<div v-if="!user" class="text-red-400">Sign up or log in to comment</div>
				<Comment v-for="comment in news.comments" :key="comment.id" :comment="comment" :user="user" :newsId="news.id"
					@onCommentChange="fetchNews()" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { customAlphabet } from 'nanoid';
import Comment from './Comment.vue';
import useUserStore from '../../store/user';
import useNewsStore from '../../store/news';
import axiosClient from '../../axios';


const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const newsStore = useNewsStore()

const { newsList, tags } = storeToRefs(newsStore)


const { fetchNews } = newsStore

const selectedTag = ref(null)

const nanoid = customAlphabet('1234567890', 6)

const commentToAdd = ref(null)

const filteredNewsList = computed(() => {
	if (selectedTag.value && selectedTag.value !== 'all') {
		return newsList.value.filter(news => news.tag === selectedTag.value)
	}

	return newsList.value
})


await	fetchNews()


async function addComment(newId) {
	try {
		let cmt = commentToAdd.value

		commentToAdd.value = ''

		await axiosClient.post(`/articles/comments/${newId}`, {
			id: parseInt(nanoid()),
			content: cmt,
			user_id: user.value.id,
			user_name: user.value.name,
			updated_on: new Date().toISOString()
		})

		await fetchNews()

	} catch (error) {
		console.log(error);
	}
}

</script>

<style scoped>
.news-content:deep() iframe {
	width: 560px;
	height: 314px;
}

@media only screen and (max-width: 640px) {
	.news {
		max-height: 500px;
	}

	.news-content:deep() iframe {
		width: 330px;
		height: 185px;
	}
}
</style>
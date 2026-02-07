<template>
	<div class="flex flex-1 flex-col">
		<button @click="add" class="text-xl cursor-pointer mt-4">Add post</button>
		<div class="flex items-center text-xl gap-6 px-4 mt-2">
			<p class="font-semibold">Year</p>
			<p v-for="year in years" :key="year" @click="selectedYear = year"
				:style="{ color: selectedYear === year ? '#2ecc71' : '#000' }" class="cursor-pointer">{{ year }}</p>
		</div>
		<div class="flex items-center text-xl gap-6 px-4 mt-2">
			<p class="font-semibold">Month</p>
			<p @click="selectedMonth = n" v-for="n in 12" :key="n" :style="{ color: selectedMonth === n ? '#2ecc71' : '#000' }"
				class="active:text-green-400 cursor-pointer">{{ n }}</p>
		</div>
		<div class="flex flex-wrap gap-8 w-full items-center justify-center border-b border-t border-black p-4 mt-4">
			<div @click="edit(post)" v-for="post in posts" :key="post.id"
				class="flex flex-col gap-2 w-[350px] h-[150px] border border-slate-400 rounded-md shadow-md p-2 hover:bg-slate-100 cursor-pointer">
				<p class="font-semibold text-justify">{{ post.header }}</p>
				<div class="flex flex-col flex-1 justify-end">
					<p class="text-sm">{{ post.updated_on.slice(5, 10) }}</p>
				</div>
			</div>
		</div>
		<div v-if="addError" class="text-xl font-medium text-red-500 px-8 pt-4">
			{{ addError }}
		</div>
		<div v-if="showEditor" class="px-8 py-4">
			<div class="flex items-center gap-8">
				<div class="flex items-baseline gap-2 text-xl">
					<p class="font-medium">Tag</p>
					<input v-model="tagToSubmit" type="text"
						class="bg-transparent outline-none text-center border-b border-black w-[200px]">
				</div>
				<div class="flex items-baseline gap-2 text-xl">
					<p class="font-medium">Header</p>
					<input v-model="headerToSubmit" type="text"
						class="bg-transparent outline-none text-center border-b border-black w-[1200px]">
				</div>
			</div>

			<!-- notes -->
			<div class="py-4">
				<editor tinymce-script-src="tinymce/tinymce.min.js" plugins="image media link lists wordcount"
					v-model="contentToSubmit"
					toolbar="h1 h2 h3 h4 h5 h6 | bold italic strikethrough underline | numlist bullist | undo redo | formatselect | media" />
				<div class="flex items-center gap-2 text-xl">
					<button @click="submitChange"
						class="border-slate-400 w-max font-medium border rounded-md hover:bg-slate-100 mt-4 p-2 cursor-pointer">
						save
					</button>
					<button v-if="editing" @click="deletePost"
						class="border-slate-400 w-max font-medium border rounded-md hover:bg-slate-100 mt-4 p-2 cursor-pointer text-red-400">
						delete
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import Editor from '@tinymce/tinymce-vue';
import { customAlphabet } from 'nanoid';
import { useStorage } from '@vueuse/core';
import axiosClient from '@/axios';

const nanoid = customAlphabet('1234567890', 6);
const user = useStorage('user', { token: '', id: -1, name: '', role: '' });
axiosClient.defaults.headers.common['Authorization'] = `Bearer ${user.value.token}`;

const date = new Date();
const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027];

const selectedYear = ref(date.getFullYear());
const selectedMonth = ref(date.getMonth() + 1);

const posts = ref([]);
const allPosts = ref([]);

const showEditor = ref(null);
const editing = ref(null);

const selectedPostId = ref(-1);

const headerToSubmit = ref('');
const contentToSubmit = ref('');
const tagToSubmit = ref('');


const addError = ref('');

const clearInput = () => {
	selectedPostId.value = -1;


	headerToSubmit.value = '';
	contentToSubmit.value = '';
	tagToSubmit.value = '';
}

const add = () => {
	showEditor.value = true;
	editing.value = false;

	clearInput();
}

const edit = (post) => {
	showEditor.value = true;
	editing.value = true;

	selectedPostId.value = post.id;

	headerToSubmit.value = post.header;
	contentToSubmit.value = post.content;
	tagToSubmit.value = post.tag;
}

const getPosts = async () => {
	try {
		const postsData = await axiosClient.get(`/articles`);
		postsData.data.sort((a, b) => {
			if (a.updated_on > b.updated_on) {
				return -1;
			}
			if (a.updated_on < b.updated_on) {
				return 1;
			}
			return 0;
		});
		allPosts.value = postsData.data;
	} catch (error) {
		console.log(error);
	}
}

await getPosts();

watchEffect(() => {
	clearInput();
	editing.value = false;
	posts.value = allPosts.value.filter(post => {
		const date = new Date(post.updated_on);
		// console.log('date', date.getFullYear(), date.getMonth());
		return date.getFullYear() === selectedYear.value && date.getMonth() === selectedMonth.value - 1;
	})
});

const submitChange = async () => {
	try {
		addError.value = '';
		if (!contentToSubmit.value || !headerToSubmit.value || !tagToSubmit.value) {
			addError.value = 'All fields are required!';
			return;
		}
		console.log('content', contentToSubmit.value);

		if (selectedPostId.value === -1) {
			// new post
			const createResult = await axiosClient.post(`/articles`, {
				id: parseInt(nanoid()),
				published_by: user.value.name,
				updated_on: new Date().toISOString(),
				header: headerToSubmit.value,
				content: contentToSubmit.value,
				tag: tagToSubmit.value,
				comments: []
			});
			console.log('create result', createResult.data);
		} else {
			// edit an existing post
			const updateResult = await axiosClient.put(`/articles/${selectedPostId.value}`, {
				published_by: user.value.name,
				// updated_on: new Date().toISOString(),
				header: headerToSubmit.value,
				content: contentToSubmit.value,
				tag: tagToSubmit.value,
			});
			console.log('update result', updateResult.data);
		}

		editing.value = false;
		clearInput();

		await getPosts();
	} catch (error) {
		addError.value = 'Error inserting this post!';
		console.log(error.message);
	}
};

const deletePost = async () => {
	const id = selectedPostId.value;
	// delete Post	
	if (confirm('do you want to delete this post?')) {
		try {
			await axiosClient.delete(`/articles/${id}`);
			await getPosts();

			editing.value = false;
			clearInput();
		} catch (error) {
			console.log(error);
		}
	}
}
</script>
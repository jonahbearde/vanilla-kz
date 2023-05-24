<template>
	<div class="flex flex-1 flex-col">
		<div @click="add" class="flex w-full items-center justify-center text-xl border-b border-black py-2 cursor-pointer">
			Add resource
		</div>
		<div class="flex items-center justify-center gap-10 text-xl py-2 ">
			<p @click="switchCate('VNL')" class="cursor-pointer">VNL</p>
			<p @click="switchCate('GOKZ')" class="cursor-pointer">GOKZ</p>
		</div>
		<div class="flex flex-wrap gap-8 w-full items-center justify-center border-b border-t border-black p-4">
			<div @click="edit(resource)" v-for="resource in resources" :key="resource.id"
				class="border border-slate-400 font-semibold text-justify rounded-md shadow-md p-2 hover:bg-slate-100 cursor-pointer">
				{{ resource.name }}
			</div>
		</div>
		<div v-if="showEditor" class="px-8 py-4">
			<div class="flex items-center gap-8">
				<div class="flex items-baseline gap-2 text-xl">
					<p class="font-medium">Name</p>
					<input v-model="nameToSubmit" type="text"
						class="bg-transparent outline-none text-center border-b border-black w-[300px]">
				</div>
				<div class="flex items-baseline gap-2 text-xl">
					<p class="font-medium">link</p>
					<input v-model="linkToSubmit" type="text"
						class="bg-transparent outline-none text-center border-b border-black w-[1000px]">
				</div>
			</div>

			<!-- notes -->
			<div class="py-4">
				<editor tinymce-script-src="tinymce/tinymce.min.js" plugins="image media link lists wordcount" v-model="descToSubmit"
					toolbar="h1 h2 h3 h4 h5 h6 | bold italic strikethrough underline | numlist bullist | undo redo | formatselect | media" />
				<div class="flex items-center gap-2 text-xl">
					<button @click="submitChange"
						class="border-slate-400 w-max font-medium border rounded-md hover:bg-slate-100 mt-4 p-2 cursor-pointer">
						save
					</button>
					<button v-if="editing" @click="deleteResource"
						class="border-slate-400 w-max font-medium border rounded-md hover:bg-slate-100 mt-4 p-2 cursor-pointer text-red-400">
						delete
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import Editor from '@tinymce/tinymce-vue';
import { customAlphabet } from 'nanoid';
import { useStorage } from '@vueuse/core';

const nanoid = customAlphabet('1234567890', 6);
const user = useStorage('user', { token: '', id: -1, name: '', role: '' });
axios.defaults.headers.common['Authorization'] = `Bearer ${user.value.token}`;

const resources = ref([]);
const allResources = ref([]);

const showEditor = ref(null);
const editing = ref(null);

const selectedResourceId = ref(-1);

const nameToSubmit = ref('');
const linkToSubmit = ref('');
const descToSubmit = ref('');

const category = ref('VNL');

const addError = ref('');

const switchCate = (cate) => {
	showEditor.value = false;
	clearInput();
	category.value = cate;
	resources.value = allResources.value.filter(resource => resource.category === cate);
}

const clearInput = () => {
	selectedResourceId.value = -1;


	nameToSubmit.value = '';
	linkToSubmit.value = '';
	descToSubmit.value = '';
}

const add = () => {
	showEditor.value = true;
	editing.value = false;

	clearInput();
}

const edit = (resource) => {
	showEditor.value = true;
	editing.value = true;

	selectedResourceId.value = resource.id;

	nameToSubmit.value = resource.name;
	linkToSubmit.value = resource.link;
	descToSubmit.value = resource.desc;
}

const getResources = async (cate) => {
	try {
		const resourcesData = await axios.get(`https://vnl-stats-backend.onrender.com/api/v1/resources`);
		allResources.value = resourcesData.data;
		resources.value = allResources.value.filter(resource => resource.category === cate);
	} catch (error) {
		console.log(error);
	}
}

await getResources('VNL');

const submitChange = async () => {
	try {
		addError.value = '';
		if (!descToSubmit.value || !linkToSubmit.value || !nameToSubmit.value) {
			addError.value = 'All fields are required!';
			return;
		}
		console.log('desc', descToSubmit.value);

		let resourceId = selectedResourceId.value === -1 ? parseInt(nanoid()) : selectedResourceId.value;
		const upsertResult = await axios.put(`https://vnl-stats-backend.onrender.com/api/v1/resources/${resourceId}`, {
			id: resourceId,
			name: nameToSubmit.value,
			link: linkToSubmit.value,
			desc: descToSubmit.value,
			category: category.value
		});

		console.log('upserted resource', upsertResult.data);

		editing.value = false;
		clearInput();

		await getResources(category.value);
	} catch (error) {
		addError.value = 'Error inserting this resource!';
		console.log(error.message);
	}
};

const deleteResource = async () => {
	const id = selectedResourceId.value;
	// delete Resource	
	if (confirm('do you want to delete this resource?')) {
		try {
			await axios.delete(`https://vnl-stats-backend.onrender.com/api/v1/resources/${id}`);
			await getResources(category.value);

			editing.value = false;
			clearInput();
		} catch (error) {
			console.log(error);
		}
	}
}
</script>
<template>
	<div class="flex flex-1 flex-col">
		<!-- search -->
		<div class="flex w-full items-center justify-center border-b border-black py-2">
			<div class="flex items-center gap-4 px-8">
				<button @click="switchType(0)"
					class="border-slate-400 w-max font-medium border rounded-md hover:bg-slate-100 p-2 cursor-pointer">
					Impossible
				</button>
				<button @click="switchType(1)"
					class="border-slate-400 w-max font-medium border rounded-md hover:bg-slate-100 p-2 cursor-pointer">
					Unfeasible
				</button>
				<button @click="switchType(2)"
					class="border-slate-400 w-max font-medium border rounded-md hover:bg-slate-100 p-2 cursor-pointer">
					Feasible
				</button>
			</div>

			<input @input="getSearchResults" v-model="mapsearch" type="text" placeholder="search a map"
				class="text-slate-400 bg-transparent outline-none text-xl max-w-[150px] h-[40px]">
			<button @click="add" class="text-xl">Add map</button>
		</div>
		<div class="flex w-full justify-center max-h-[600px] overflow-auto py-4 border-b border-black">
			<!-- table -->
			<table class="w-5/6 text-center border-collapse">
				<thead>
					<tr class="h-[20px] text-xl border-b border-slate-400">
						<th class="font-semibold cursor-pointer">Map</th>
						<th class="font-semibold cursor-pointer">Global Tier</th>
						<th class="font-semibold cursor-pointer">Release</th>
						<th class="font-semibold cursor-pointer">Type</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="map in maps" :key="map.map_id" @click="edit(map)"
						class="h-[20px] text-xl border-b border-slate-300 cursor-pointer">
						<th class="font-normal">{{ map.map_name }}</th>
						<th class="font-normal">{{ map.kztTier }}</th>
						<th class="font-normal italic">
							{{ map.releaseDate.split('T')[0] }}
						</th>
						<th class="font-normal">{{ types[mapsType] }}</th>
					</tr>
				</tbody>
			</table>
		</div>

		<div v-if="addError" class="text-xl font-medium text-red-500 px-8 pt-4">
			{{ addError }}
		</div>
		<!-- adding -->
		<div v-if="showEditor" class="px-8 py-4">
			<div class="flex items-center gap-8">
				<div class="flex items-baseline gap-2 text-xl">
					<p class="font-medium">{{ types[mapsType] }} Map</p>
					<input v-model="mapToSubmit" type="text" class="bg-transparent outline-none text-center border-b border-black">
				</div>
			</div>

			<!-- notes -->
			<div class="py-4">
				<editor tinymce-script-src="tinymce/tinymce.min.js" plugins="image link lists wordcount" v-model="notesToSubmit"
					toolbar="h1 h2 h3 h4 h5 h6 | bold italic strikethrough underline | numlist bullist | undo redo | formatselect" />
				<div class="flex items-center gap-2 text-xl">
					<button @click="submitChange"
						class="border-slate-400 w-max font-medium border rounded-md hover:bg-slate-100 mt-4 p-2 cursor-pointer">
						save
					</button>
					<button v-if="editing" @click="deleteMap"
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
import Editor from '@tinymce/tinymce-vue';
import { useStorage } from '@vueuse/core';
import axiosClient from '@/axios';
import axios from 'axios';

const user = useStorage('user', {token: '', id: -1, name: '', role: ''});
axiosClient.defaults.headers.common['Authorization'] = `Bearer ${user.value.token}`;


const maps = ref([]);
let allMaps = [];
const mapsearch = ref('');

const showEditor = ref(null);
const editing = ref(null);

const mapsType = ref(0);
const selectedMapId = ref(-1);

const mapToSubmit = ref('');
const notesToSubmit = ref('');

const addError = ref('');

const types = ['Impossible', 'Unfeasible', 'Feasible'];

const clearInput = () => {
	selectedMapId.value = -1;

	mapsearch.value = '';

	mapToSubmit.value = '';
	notesToSubmit.value = '';
}

const add = () => {
	showEditor.value = true;
	editing.value = false;

	clearInput();
}

const edit = (map) => {
	showEditor.value = true;
	editing.value = true;

	selectedMapId.value = map.map_id;

	mapToSubmit.value = map.map_name;
	notesToSubmit.value = map.notes;
}

const switchType = (type) => {
	mapsType.value = type;
	maps.value = allMaps.filter(map => {
		return map.type === type;
	})
}

const getUncompletedMaps = async () => {
	try {
		const mapsData = await axiosClient.get(`/uncompleted`);
		mapsData.data.sort((a, b) => {
			if (a.releaseDate > b.releaseDate) {
				return -1;
			}
			if (a.releaseDate < b.releaseDate) {
				return 1;
			}
			return 0;
		});
		allMaps = mapsData.data;
		// maps.value = allMaps.filter(map => {
		// 	return map.type === mapsType.value
		// });
		maps.value = allMaps;
	} catch (error) {
		console.log(error);
	}
}

await getUncompletedMaps();

const getSearchResults = () => {
	// searchError.value = false;
	if (mapsearch.value !== '') {
		showEditor.value = false;
		addError.value = '';
		let pattern = new RegExp(mapsearch.value);
		maps.value = allMaps
			.filter(map => {
				return map.type === mapsType.value;
			})
			.filter(map => {
				return pattern.test(map.map_name);
			})
			.slice(0, 20);
	} else {
		maps.value = allMaps.filter(map => {
			return map.type === mapsType.value;
		});
	}
}

const submitChange = async () => {
	try {
		addError.value = '';

		if (!mapToSubmit.value || !notesToSubmit.value) {
			addError.value = 'All fields are required!';
			return;
		}

		console.log('notes', notesToSubmit.value);

		const result = await axios.get(`https://kzgo.eu/api/maps/${mapToSubmit.value}`);

		if (!result.data) {
			addError.value = 'Map is not globalled!';
			return;
		}

		const map = result.data;
		let mapObj = {
			map_name: mapToSubmit.value,
			map_id: map.id,
			kztTier: map.tier,
			notes: notesToSubmit.value,
			type: mapsType.value,
			releaseDate: map.date
		};

		const upsertResult = await axiosClient.put(`/uncompleted/${map.id}`, mapObj);

		console.log('upserted map', upsertResult.data);

		editing.value = false;
		clearInput();

		await getUncompletedMaps();
	} catch (error) {
		addError.value = 'Error inserting this map!';
		console.log(error.message);
	}
};

const deleteMap = async () => {
	const id = selectedMapId.value;
	// delete map	
	if (confirm('do you want to delete this map?')) {
		try {
			await axiosClient.delete(`/uncompleted/${id}`);

			await getUncompletedMaps();

			editing.value = false;
			clearInput();
		} catch (error) {
			console.log(error);
		}
	}
}
</script>
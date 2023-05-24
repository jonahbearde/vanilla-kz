<template>
	<div class="flex flex-1 flex-col">
		<!-- search -->
		<div class="flex w-full items-center gap-4 text-xl justify-center border-b border-slate-600 py-2">
			<p class="">total: {{ maps.length }}</p>
			<input @input="getSearchResults" v-model="mapsearch" type="text" placeholder="search a map"
				class="text-slate-400 bg-transparent outline-none max-w-[140px]">
			<button @click="add" class="">Add map</button>
		</div>
		<div class="flex w-full justify-center max-h-[600px] overflow-auto py-4 border-b border-slate-600">
			<!-- table -->
			<table class="w-5/6 text-center border-collapse">
				<thead>
					<tr class="h-[20px] text-xl border-b border-slate-400">
						<th class="font-semibold cursor-pointer">Map</th>
						<th class="font-semibold cursor-pointer">TP Tier</th>
						<th class="font-semibold cursor-pointer">PRO Tier</th>
						<th class="font-semibold cursor-pointer">Release</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="map in maps" :key="map.id" @click="edit(map)"
						class="h-[20px] text-xl border-b border-slate-600 cursor-pointer">
						<th class="font-normal">{{ map.name }}</th>
						<th class="font-normal">{{ map.tpTier }}</th>
						<th class="font-normal">{{ map.proTier }}</th>
						<th class="font-normal italic">
							{{ map.releaseDate.split('T')[0] }}
						</th>
					</tr>
				</tbody>
			</table>
		</div>

		<div v-if="addError" class="text-xl font-medium text-red-500 px-8 pt-4">
			{{ addError }}
		</div>
		<!-- adding -->
		<div v-if="showEditor" class="px-8 py-4">
			<div class="flex items-center gap-16">
				<div class="flex items-baseline gap-2 text-xl">
					<p class="font-medium">Map</p>
					<input v-model="mapToSubmit" type="text"
						class="bg-transparent outline-none text-center border-b border-slate-600">
				</div>
				<div class="flex items-baseline gap-2 text-xl">
					<p class="font-medium">TP Tier</p>
					<input v-model="tpTierToSubmit" type="text"
						class="bg-transparent outline-none text-center border-b border-slate-600 w-[40px]">
				</div>
				<div class="flex items-baseline gap-2 text-xl">
					<p class="font-medium">Pro Tier</p>
					<input v-model="proTierToSubmit" type="text"
						class="bg-transparent outline-none text-center border-b border-slate-600 w-[40px]">
				</div>
			</div>

			<!-- notes -->
			<div class="py-4">
				<editor tinymce-script-src="tinymce/tinymce.min.js" plugins="image media link lists wordcount" v-model="notesToSubmit"
					toolbar="h1 h2 h3 h4 h5 h6 | bold italic strikethrough underline | numlist bullist | undo redo | formatselect | media" />
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
import axios from 'axios';
import Editor from '@tinymce/tinymce-vue';
import { useStorage } from '@vueuse/core';

const user = useStorage('user', { token: '', id: -1, name: '', role: '' });
axios.defaults.headers.common['Authorization'] = `Bearer ${user.value.token}`;


const maps = ref([]);
let allMaps = [];
const mapsearch = ref('');

const showEditor = ref(null);
const editing = ref(null);

const selectedMapId = ref(-1);

const mapToSubmit = ref('');
const tpTierToSubmit = ref('');
const proTierToSubmit = ref('');
const notesToSubmit = ref('');

const addError = ref('');

const clearInput = () => {
	selectedMapId.value = -1;

	mapsearch.value = '';

	mapToSubmit.value = '';
	tpTierToSubmit.value = '';
	proTierToSubmit.value = '';
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

	selectedMapId.value = map.id;

	mapToSubmit.value = map.name;
	tpTierToSubmit.value = map.tpTier;
	proTierToSubmit.value = map.proTier;
	notesToSubmit.value = map.notes;
}

const getPossibleMaps = async () => {
	try {
		const mapsData = await axios.get(`https://vnl-stats-backend.onrender.com/api/v1/maps`);
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
		maps.value = allMaps;
	} catch (error) {
		console.log(error);
	}
}

await getPossibleMaps();

const getSearchResults = () => {
	// searchError.value = false;
	if (mapsearch.value !== '') {
		showEditor.value = false;
		addError.value = '';
		let pattern = new RegExp(mapsearch.value);
		maps.value = allMaps.filter(map => {
			return pattern.test(map.name);
		})
			.slice(0, 20);
	} else {
		maps.value = allMaps;
	}
}

const submitChange = async () => {
	try {
		addError.value = '';
		if (!mapToSubmit.value || !tpTierToSubmit.value || !proTierToSubmit.value || !notesToSubmit.value) {
			addError.value = 'All fields are required!';
			return;
		}

		const result = await axios.get(`https://kzgo.eu/api/maps/${mapToSubmit.value.trim()}`);

		if (!result.data) {
			addError.value = 'Map is not globalled!';
			return;
		}

		const map = result.data;
		let mapObj = {
			name: mapToSubmit.value.trim(),
			id: map.id,
			tpTier: parseInt(tpTierToSubmit.value),
			proTier: parseInt(proTierToSubmit.value),
			kztTier: map.tier,
			notes: notesToSubmit.value,
			workshopId: map.workshopId,
			mapperIds: map.mapperIds,
			mapperNames: map.mapperNames,
			releaseDate: map.date
		};

		const upsertResult = await axios.put(`https://vnl-stats-backend.onrender.com/api/v1/maps/${map.id}`, mapObj);

		console.log('upserted map', upsertResult.data);

		editing.value = false;
		clearInput();

		await getPossibleMaps();
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
			await axios.delete(`https://vnl-stats-backend.onrender.com/api/v1/maps/${id}`);
			await getPossibleMaps();

			editing.value = false;
			clearInput();
		} catch (error) {
			console.log(error);
		}
	}
}
</script>
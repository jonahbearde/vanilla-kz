<template>
  <div class="flex flex-1 flex-col">
    <!-- search -->
    <div class="flex w-full items-center justify-center text-xl border-b border-black py-2">
      <input
        @input="getSearchResults"
        v-model="bonusSearch"
        type="text"
        placeholder="search bonuses"
        class="text-slate-400 bg-transparent outline-none max-w-[180px] h-[40px]"
      />
      <button @click="add">Add bonus</button>
    </div>
    <div class="flex w-full justify-center max-h-[600px] overflow-auto py-4 border-b border-black">
      <!-- table -->
      <table class="w-5/6 text-center border-collapse">
        <thead>
          <tr class="h-[20px] text-xl border-b border-slate-400">
            <th class="font-semibold cursor-pointer">Map</th>
            <th class="font-semibold cursor-pointer">Bonus Number</th>
            <th class="font-semibold cursor-pointer">TP Tier</th>
            <th class="font-semibold cursor-pointer">PRO Tier</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="bonus in bonuses"
            :key="bonus.id"
            @click="edit(bonus)"
            class="h-[20px] text-xl border-b border-slate-300 cursor-pointer"
          >
            <th class="font-normal">{{ bonus.map_name }}</th>
            <th class="font-normal">{{ bonus.bonus_number }}</th>
            <th class="font-normal">{{ bonus.tpTier }}</th>
            <th class="font-normal">{{ bonus.proTier }}</th>
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
          <input
            v-model="mapToSubmit"
            type="text"
            class="bg-transparent outline-none text-center border-b border-black"
          />
        </div>
        <div class="flex items-baseline gap-2 text-xl">
          <p class="font-medium">Bonus Number</p>
          <input
            v-model="bonusNumberToSubmit"
            type="text"
            class="bg-transparent outline-none text-center border-b border-black w-[40px]"
          />
        </div>
        <div class="flex items-baseline gap-2 text-xl">
          <p class="font-medium">TP Tier</p>
          <input
            v-model="tpTierToSubmit"
            type="text"
            class="bg-transparent outline-none text-center border-b border-black w-[40px]"
          />
        </div>
        <div class="flex items-baseline gap-2 text-xl">
          <p class="font-medium">Pro Tier</p>
          <input
            v-model="proTierToSubmit"
            type="text"
            class="bg-transparent outline-none text-center border-b border-black w-[40px]"
          />
        </div>
      </div>

      <!-- notes -->
      <div class="py-4">
        <editor
          tinymce-script-src="tinymce/tinymce.min.js"
          plugins="image media link lists wordcount"
          v-model="notesToSubmit"
          toolbar="h1 h2 h3 h4 h5 h6 | bold italic strikethrough underline | numlist bullist | undo redo | formatselect"
        />
        <div class="flex items-center gap-2 text-xl">
          <button
            @click="submitChange"
            class="border-slate-400 w-max font-medium border rounded-md hover:bg-slate-100 mt-4 p-2 cursor-pointer"
          >
            save
          </button>
          <button
            v-if="editing"
            @click="deletebonus"
            class="border-slate-400 w-max font-medium border rounded-md hover:bg-slate-100 mt-4 p-2 cursor-pointer text-red-400"
          >
            delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import Editor from "@tinymce/tinymce-vue";
import {customAlphabet} from "nanoid";
import {useStorage} from "@vueuse/core";
import axios from 'axios';
import axiosClient from "@/axios";

const user = useStorage("user", {token: "", id: -1, name: "", role: ""});
axios.defaults.headers.common["Authorization"] = `Bearer ${user.value.token}`;

const nanoid = customAlphabet("1234567890", 6);

const bonuses = ref([]);
let allBonuses = [];
const bonusSearch = ref("");

const showEditor = ref(null);
const editing = ref(null);

const selectedBonus = ref(null);

const mapToSubmit = ref("");
const bonusNumberToSubmit = ref("");
const tpTierToSubmit = ref("");
const proTierToSubmit = ref("");
const notesToSubmit = ref("");

const addError = ref("");

const clearInput = () => {
  selectedBonus.value = null;

  bonusSearch.value = "";

  mapToSubmit.value = "";
  bonusNumberToSubmit.value = "";
  tpTierToSubmit.value = "";
  proTierToSubmit.value = "";
  notesToSubmit.value = "";
};

const add = () => {
  showEditor.value = true;
  editing.value = false;

  clearInput();
};

const edit = (bonus) => {
  showEditor.value = true;
  editing.value = true;

  selectedBonus.value = bonus;

  mapToSubmit.value = bonus.map_name;
  bonusNumberToSubmit.value = bonus.bonus_number;
  tpTierToSubmit.value = bonus.tpTier;
  proTierToSubmit.value = bonus.proTier;
  notesToSubmit.value = bonus.notes;
};

const getPossibleBonuses = async () => {
  try {
    const bonusesData = await axiosClient.get(`/bonus`);
    bonusesData.data.sort((a, b) => {
      if (a.releaseDate > b.releaseDate) {
        return -1;
      }
      if (a.releaseDate < b.releaseDate) {
        return 1;
      }
      return 0;
    });
    allBonuses = bonusesData.data;
    bonuses.value = allBonuses;
  } catch (error) {
    console.log(error);
  }
};

await getPossibleBonuses();

const getSearchResults = () => {
  // searchError.value = false;
  if (bonusSearch.value !== "") {
    showEditor.value = false;
    addError.value = "";
    let pattern = new RegExp(bonusSearch.value);
    bonuses.value = allBonuses
      .filter((bonus) => {
        return pattern.test(bonus.map_name);
      })
      .slice(0, 20);
  } else {
    bonuses.value = allBonuses;
  }
};

const submitChange = async () => {
  try {
    addError.value = "";
    if (
      !mapToSubmit.value ||
      !bonusNumberToSubmit.value ||
      !tpTierToSubmit.value ||
      !proTierToSubmit.value ||
      !notesToSubmit.value
    ) {
      addError.value = "All fields are required!";
      return;
    }

    console.log("notes", notesToSubmit.value);

    const result = await axios.get(`https://kzgo.eu/api/maps/${mapToSubmit.value}`);

    if (!result.data) {
      addError.value = "Map is not globalled!";
      return;
    }

    const map = result.data;
    let bonusId = selectedBonus.value ? selectedBonus.value.id : parseInt(nanoid());
    let bonusObj = {
      id: bonusId,
      map_name: map.name,
      map_id: map.id,
      bonus_number: parseInt(bonusNumberToSubmit.value),
      tpTier: parseInt(tpTierToSubmit.value),
      proTier: parseInt(proTierToSubmit.value),
      notes: notesToSubmit.value,
    };

    const upsertResult = await axiosClient.put(`/bonus/${bonusId}`, bonusObj);

    console.log("upserted bonus", upsertResult.data);

    editing.value = false;
    clearInput();

    await getPossibleBonuses();
  } catch (error) {
    addError.value = "Error inserting this bonus!";
    console.log(error.message);
  }
};

const deletebonus = async () => {
  const bonus = selectedBonus.value;
  // delete bonus
  if (confirm("do you want to delete this bonus?")) {
    try {
      await axiosClient.delete(`/bonus/${bonus.id}`);
      await getPossibleBonuses();

      editing.value = false;
      clearInput();
    } catch (error) {
      console.log(error);
    }
  }
};
</script>

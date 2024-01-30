<template>
  <div class="w-[300px] sm:w-[400px]">
    <div class="grid grid-cols-5 border-b-2 border-slate-400">
      <p>#</p>
      <p class="col-span-3">Player</p>
      <p>WRs</p>
    </div>

    <div
      v-for="(item, index) in props.rankings"
      :key="item.steamid64"
      class="group relative grid grid-cols-5 py-1 border-b border-slate-600"
    >
      <p>{{ index + 1 }}</p>
      <RouterLink
        :to="{ name: 'stats', params: { steamid: item.steamid64 } }"
        class="col-span-3 text-[#00cec9] font-medium truncate"
      >
        {{ item.player_name }}
      </RouterLink>
      <p class="">{{ item.count }}</p>
      <div
        v-if="!props.bonus"
        class="hidden group-hover:sm:block z-[2] absolute left-10 top-8 p-2 max-h-[500px] w-[350px] overflow-auto bg-slate-50 dark:bg-gray-700 border border-slate-400 rounded-md"
      >
        <WrList :wr-list="item.wrs" />
      </div>
    </div>
  </div>
</template>

<script setup>
import WrList from "./WrList.vue"
const props = defineProps({
  rankings: {
    type: Object,
    required: true,
  },
  bonus: {
    type: Boolean,
    default: false,
  },
})
</script>

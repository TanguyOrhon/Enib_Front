<template>
  <div class="pager-wrapper">
    <label class="page-size-wrapper">
      Livres par page
      <select
        class="page-size-select"
        :value="pageSize"
        @change="changePageSize"
      >
        <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
      </select>
    </label>
    <button class="pager-button" :disabled="page === 1" @click="changePage(page - 1)">
      <ChevronLeftIcon class="icons" />
    </button>
    <div>Page {{ page }} / {{ pageMax }}</div>
    <button class="pager-button" :disabled="page === pageMax" @click="changePage(page + 1)">
      <ChevronRightIcon class="icons" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  page: number
  pageMax: number
  pageSize: number
}>()

const emit = defineEmits<{
  (e: 'changePage', page: number): void
  (e: 'changePageSize', pageSize: number): void
}>()

const pageSizes = [20, 50, 100]

function changePage(newPage: number) {
  if (newPage >= 1 && newPage <= props.pageMax) {
    emit('changePage', newPage)
  }
}

function changePageSize(event: Event) {
  emit('changePageSize', Number((event.target as HTMLSelectElement).value))
}
</script>

<template>
  <div class="pager-wrapper">
    <div class="page-size-wrapper">
      <label for="page-size">Livres par page</label>
      <select id="page-size" :value="pageSize" class="page-size-select" @change="changePageSize">
        <option v-for="size in pageSizes" :key="size" :value="size">
          {{ size }}
        </option>
      </select>
    </div>
    <div class="page-counter">Page {{ page }} / {{ pageMax }}</div>
    <div class="page-buttons">
      <button :disabled="page === 1" @click="pageDown">
        <ChevronLeftIcon class="icons" />
      </button>
      <button :disabled="page === pageMax" @click="pageUp">
        <ChevronRightIcon class="icons" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  page: number
  pageMax: number
  pageSize: number
}>()

const pageSizes = [20, 50, 100]

const emits = defineEmits<{
  (e: 'changePage', page: number): void
  (e: 'changePageSize', pageSize: number): void
}>()

function pageUp() {
  emits('changePage', props.page + 1)
}

function pageDown() {
  emits('changePage', props.page - 1)
}

function changePageSize(event: Event) {
  const target = event.target as HTMLSelectElement
  emits('changePageSize', Number(target.value))
}
</script>

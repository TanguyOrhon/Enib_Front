<template>
  <div class="pager-wrapper">
    <div class="page-size-wrapper">
      <label for="page-size" class="page-size-label">Livres par page</label>
      <select
        id="page-size"
        class="page-size-select"
        :value="itemsPerPage"
        @change="changeItemsPerPage"
      >
        <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>
    <div class="page-controls">
      <button class="pager-button" type="button" :disabled="currentPage === 1" @click="pageDown">
        <ChevronLeftIcon class="icons" />
      </button>
      <div class="page-indicator">Page {{ currentPage }} sur {{ totalPages }}</div>
      <button
        class="pager-button"
        type="button"
        :disabled="currentPage === totalPages"
        @click="pageUp"
      >
        <ChevronRightIcon class="icons" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  currentPage: number
  totalPages: number
  itemsPerPage: number
  itemsPerPageOptions: number[]
}>()

const emits = defineEmits<{
  (e: 'changePage', page: number): void
  (e: 'changeItemsPerPage', itemsPerPage: number): void
}>()

function pageUp() {
  emits('changePage', Math.min(props.currentPage + 1, props.totalPages))
}

function pageDown() {
  emits('changePage', Math.max(props.currentPage - 1, 1))
}

function changeItemsPerPage(event: Event) {
  const target = event.target as HTMLSelectElement
  emits('changeItemsPerPage', Number.parseInt(target.value, 10))
}
</script>

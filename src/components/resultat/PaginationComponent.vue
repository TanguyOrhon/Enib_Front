<template>
  <div class="pager-wrapper">
    <button :disabled="page === 1" @click="pageDown">
      <ChevronLeftIcon class="icons" />
    </button>
    <div>{{ page }} / {{ pageMax }}</div>
    <button :disabled="page === pageMax" @click="pageUp">
      <ChevronRightIcon class="icons" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'

defineProps<{
  pageMax: number
}>()

const emits = defineEmits<{
  (e: 'changePage', page: number): void
}>()

const page = ref<number>(1)

function pageUp() {
  page.value++
  emits('changePage', page.value)
}

function pageDown() {
  page.value--
  emits('changePage', page.value)
}
</script>

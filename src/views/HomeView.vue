<template>
  <div class="home">
    <SearchComponent @filter-books="filterBooks" />
    <ResultatComponent ref="results" />
  </div>
</template>

<script lang="ts" setup>
import SearchComponent from '@/components/SearchComponent.vue'
import ResultatComponent from '@/components/ResultatComponent.vue'
import { ref } from 'vue'
import type { BookFilters } from '@/types/BookFilters'

const results = ref<null | InstanceType<typeof ResultatComponent>>()

function filterBooks(filters: BookFilters) {
  results.value?.setFilters(filters)
}
</script>

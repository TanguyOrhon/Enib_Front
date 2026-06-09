<template>
  <div class="home">
    <SearchComponent @search="search" />
    <ResultatComponent ref="results" />
  </div>
</template>

<script lang="ts" setup>
import SearchComponent from '@/components/SearchComponent.vue'
import { BookFilters } from '@/types/BookFilters'
import ResultatComponent from '@/components/ResultatComponent.vue'
import { ref } from 'vue'

const results = ref<null | InstanceType<typeof ResultatComponent>>()

function search(filters: BookFilters) {
  results.value?.applyFilters(filters)
}
</script>

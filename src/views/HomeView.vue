<template>
  <div class="home">
    <SearchComponent />
    <ResultatComponent ref="results" />
  </div>
</template>

<script lang="ts" setup>
import SearchComponent from '@/components/SearchComponent.vue'
import ResultatComponent from '@/components/ResultatComponent.vue'
import { ref } from 'vue'

const results = ref<null | InstanceType<typeof ResultatComponent>>()

function search(author: string) {
  results.value?.searchAuthor(author)
}

search('')
</script>

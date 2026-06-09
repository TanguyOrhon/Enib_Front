<template>
  <form class="search-wrapper" @submit.prevent="applyFilters">
    <input v-model="author" type="text" class="search-input" placeholder="Auteur" />
    <input v-model="title" type="text" class="search-input" placeholder="Titre" />
    <input v-model="releaseDate" type="date" class="search-input" aria-label="Date de sortie" />
    <button type="submit" class="search-button">Recherche</button>
    <button type="button" class="reset-search-button" @click="resetFilters">Réinitialiser</button>
  </form>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { BookFilters } from '@/types/BookFilters'

const author = ref('')
const title = ref('')
const releaseDate = ref('')

const emit = defineEmits<{
  (e: 'search', filters: BookFilters): void
}>()

function applyFilters() {
  emit('search', {
    author: author.value,
    title: title.value,
    releaseDate: releaseDate.value
  })
}

function resetFilters() {
  author.value = ''
  title.value = ''
  releaseDate.value = ''
  applyFilters()
}
</script>

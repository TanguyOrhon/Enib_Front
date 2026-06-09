<template>
  <form class="search-wrapper" @submit.prevent>
    <div class="search-field">
      <label class="search-label" for="title-search">Titre</label>
      <input
        id="title-search"
        v-model="titleSearch"
        type="text"
        class="search-input"
        placeholder="Rechercher par titre"
        @input="emitFilters"
      />
    </div>
    <div class="search-field">
      <label class="search-label" for="author-search">Auteur</label>
      <input
        id="author-search"
        v-model="authorSearch"
        type="text"
        class="search-input"
        placeholder="Rechercher par auteur"
        @input="emitFilters"
      />
    </div>
    <div class="search-field">
      <label class="search-label" for="release-date-filter">Date de sortie</label>
      <input
        id="release-date-filter"
        v-model="releaseDateFilter"
        type="date"
        class="search-input"
        @change="emitFilters"
      />
    </div>
    <button
      class="search-reset-button"
      type="button"
      :disabled="!hasActiveFilters"
      @click="resetFilters"
    >
      <ArrowPathIcon class="search-button-icon" />
      Réinitialiser
    </button>
  </form>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import type { BookFilters } from '@/types/BookFilters'

const emit = defineEmits<{
  (e: 'filterBooks', filters: BookFilters): void
}>()

const titleSearch = ref('')
const authorSearch = ref('')
const releaseDateFilter = ref('')

const hasActiveFilters = computed(
  () => titleSearch.value != '' || authorSearch.value != '' || releaseDateFilter.value != ''
)

function emitFilters() {
  emit('filterBooks', {
    titleSearch: titleSearch.value,
    authorSearch: authorSearch.value,
    releaseDateFilter: releaseDateFilter.value
  })
}

function resetFilters() {
  titleSearch.value = ''
  authorSearch.value = ''
  releaseDateFilter.value = ''
  emitFilters()
}
</script>

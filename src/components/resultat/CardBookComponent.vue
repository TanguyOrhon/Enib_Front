<template>
  <div class="card-wrapper">
    <div class="title">{{ book.title }}</div>
    <div class="author">{{ book.author }}</div>
    <div class="date">{{ releaseYear }}</div>
    <div class="categories">
      <PillComponent v-for="cat in book.genre" :key="cat" :category="cat">
        {{ cat }}
      </PillComponent>
    </div>
    <div class="note">{{ note }} <StarIcon v-if="book.rating" class="icons" /></div>
    <div class="link">
      <button
        class="view-card-button"
        type="button"
        aria-label="Voir les détails du livre"
        @click="viewBook"
      >
        <EyeIcon class="icon" />
      </button>
      <button type="button" aria-label="Modifier le livre" @click="updateBook">
        <PencilIcon class="icon" />
      </button>
      <button
        class="delete-card-button"
        type="button"
        aria-label="Supprimer le livre"
        @click="requestDeleteBook"
      >
        <TrashIcon class="icon" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Book } from '@/types/Book'
import { computed, ref } from 'vue'
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/solid'
import { StarIcon } from '@heroicons/vue/24/outline'
import { formatReleaseYear, noteTo3Dec } from '@/utils/Methods'
import PillComponent from '../commons/PillComponent.vue'

const props = defineProps<{
  book: Book
}>()

const note = ref<string>(props.book.rating != undefined ? noteTo3Dec(props.book.rating) : 'NN')
const releaseYear = computed(() => formatReleaseYear(props.book.releaseDate))

function viewBook() {
  emits('viewBook', props.book)
}

function updateBook() {
  emits('updateBook', props.book)
}

function requestDeleteBook() {
  emits('deleteBook', props.book)
}

const emits = defineEmits<{
  (e: 'viewBook', book: Book): void
  (e: 'updateBook', book: Book): void
  (e: 'deleteBook', book: Book): void
}>()
</script>

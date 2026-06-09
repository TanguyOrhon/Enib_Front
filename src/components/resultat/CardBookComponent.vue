<template>
  <div class="card-wrapper">
    <div class="title">{{ book.title }}</div>
    <div class="author">{{ book.author }}</div>
    <div class="date">{{ formatReleaseYear(book.releaseDate) }}</div>
    <div class="book-categories">
      <PillComponent v-for="category in book.genre" :key="category" :category="category">
        {{ category }}
      </PillComponent>
    </div>
    <div class="note">{{ note }} <StarIcon v-if="book.rating" class="icons" /></div>
    <div class="link">
      <button title="Voir les détails" aria-label="Voir les détails" @click="viewBook">
        <EyeIcon class="icon" />
      </button>
      <button title="Modifier le livre" @click="updateBook">
        <PencilIcon class="icon" />
      </button>
      <button class="delete-book-button" title="Supprimer le livre" @click="deleteBook">
        <TrashIcon class="icon" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Book } from '@/types/Book'
import { ref } from 'vue'
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/solid'
import { StarIcon } from '@heroicons/vue/24/outline'
import { noteTo3Dec } from '@/utils/Methods'
import PillComponent from '../commons/PillComponent.vue'

const props = defineProps<{
  book: Book
}>()

const note = ref<string>(props.book.rating != undefined ? noteTo3Dec(props.book.rating) : 'NN')

function viewBook() {
  emits('viewBook', props.book)
}

function updateBook() {
  emits('updateBook', props.book)
}

function deleteBook() {
  emits('deleteBook', props.book)
}

function formatReleaseYear(releaseDate: string) {
  if (!releaseDate) {
    return ''
  }

  const year = releaseDate.match(/^(\d{4})/)?.[1]
  return year ?? ''
}

const emits = defineEmits<{
  (e: 'viewBook', book: Book): void
  (e: 'updateBook', book: Book): void
  (e: 'deleteBook', book: Book): void
}>()
</script>

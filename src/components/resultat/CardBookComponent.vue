<template>
  <div class="card-wrapper">
    <div class="title">{{ book.title }}</div>
    <div class="author">{{ book.author }}</div>
    <div class="date">{{ book.releaseDate }}</div>
    <div class="categories">
      <PillComponent v-for="cat in book.genre" :key="cat" :category="cat">
        {{ cat }}
      </PillComponent>
    </div>
    <div class="note">{{ note }} <StarIcon v-if="book.rating" class="icons" /></div>
    <div class="link">
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
    <BookModal v-if="showDetails" ref="modal" @on-save="onSave" />
  </div>
</template>

<script setup lang="ts">
import { Book } from '@/types/Book'
import { ref, useTemplateRef } from 'vue'
import BookModal from '../BookModal.vue'
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/solid'
import { StarIcon } from '@heroicons/vue/24/outline'
import { noteTo3Dec } from '@/utils/Methods'
import PillComponent from '../commons/PillComponent.vue'

const props = defineProps<{
  book: Book
}>()

const showDetails = ref<boolean>(true)
const modal = useTemplateRef('modal')
const note = ref<string>(props.book.rating != undefined ? noteTo3Dec(props.book.rating) : 'NN')

function updateBook() {
  emits('updateBook', props.book)
}

function requestDeleteBook() {
  emits('deleteBook', props.book)
}

async function onSave(newNote: string) {
  note.value = newNote
}

const emits = defineEmits<{
  (e: 'updateBook', book: Book): void
  (e: 'deleteBook', book: Book): void
}>()
</script>

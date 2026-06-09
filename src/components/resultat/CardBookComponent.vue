<template>
  <div class="card-wrapper">
    <div class="title">{{ book.title }}</div>
    <div class="author">{{ book.author }}</div>
    <div class="date">{{ book.releaseDate }}</div>
    <div class="note">{{ note }} <StarIcon v-if="book.rating" class="icons" /></div>
    <div class="link">
      <button @click="updateBook">
        <PencilIcon class="icon" />
      </button>
    </div>
    <BookModal v-if="showDetails" ref="modal" @on-save="onSave" />
  </div>
</template>

<script setup lang="ts">
import { Book } from '@/types/Book'
import { ref, useTemplateRef } from 'vue'
import BookModal from '../BookModal.vue'
import { PencilIcon } from '@heroicons/vue/24/solid'
import { StarIcon } from '@heroicons/vue/24/outline'
import { noteTo3Dec } from '@/utils/Methods'

const props = defineProps<{
  book: Book
}>()

const showDetails = ref<boolean>(true)
const modal = useTemplateRef('modal')
const note = ref<string>(props.book.rating != undefined ? noteTo3Dec(props.book.rating) : 'NN')

function updateBook() {
  emits('updateBook', props.book)
}

async function onSave(newNote: string) {
  note.value = newNote
}

const emits = defineEmits<{
  (e: 'updateBook', book: Book): void
}>()
</script>

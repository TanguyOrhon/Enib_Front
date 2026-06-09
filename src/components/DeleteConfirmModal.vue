<template>
  <div v-if="showModal && book != undefined" class="modal">
    <div class="wrapper">
      <div class="modal-card-wrapper">
        <div class="modal-card">
          <div class="modal-header">
            <p>Suppression d'un livre</p>
          </div>
          <hr />
          <div class="modal-body">
            <p class="confirm-message">
              Voulez-vous vraiment supprimer "{{ book.title }}" ?
            </p>
          </div>
          <hr />
          <div class="modal-footer">
            <button class="modal-button-delete" @click="confirmDelete">Supprimer</button>
            <button class="modal-button" @click="closeModal">Annuler</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Book } from '@/types/Book'
import { deleteBook } from '@/utils/Api'

const showModal = ref<boolean>(false)
const book = ref<Book | null>(null)

function closeModal() {
  book.value = null
  showModal.value = false
}

function openModal(bookToDelete: Book) {
  book.value = bookToDelete
  showModal.value = true
}

async function confirmDelete() {
  if (book.value) {
    const deleted = await deleteBook(book.value.id)
    const deletedBook = book.value
    closeModal()
    if (deleted) emit('bookDeleted', deletedBook)
  }
}

const emit = defineEmits<{
  (e: 'bookDeleted', book: Book): void
}>()

defineExpose({ openModal })
</script>

<template>
  <div v-if="showModal && book" class="modal">
    <div class="wrapper">
      <div class="modal-card-wrapper">
        <div class="modal-card delete-modal-card">
          <div class="modal-header">
            <p>Supprimer le livre</p>
          </div>
          <hr />
          <div class="modal-body">
            <p class="delete-modal-text">
              Voulez-vous vraiment supprimer
              <strong>{{ book.title }}</strong>
              ?
            </p>
            <p v-if="errorMessage" class="form-error form-error-global">{{ errorMessage }}</p>
          </div>
          <hr />
          <div class="modal-footer">
            <button
              class="modal-button-delete"
              type="button"
              :disabled="isDeleting"
              @click="confirmDelete"
            >
              {{ isDeleting ? 'Suppression...' : 'Supprimer' }}
            </button>
            <button class="modal-button" type="button" :disabled="isDeleting" @click="closeModal">
              Annuler
            </button>
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

const emit = defineEmits<{
  (e: 'deleted', book: Book): void
}>()

const showModal = ref<boolean>(false)
const book = ref<Book | null>(null)
const isDeleting = ref<boolean>(false)
const errorMessage = ref<string>('')

function openModal(bookToDelete: Book) {
  book.value = bookToDelete
  errorMessage.value = ''
  isDeleting.value = false
  showModal.value = true
}

function closeModal() {
  if (isDeleting.value) {
    return
  }

  book.value = null
  errorMessage.value = ''
  showModal.value = false
}

async function confirmDelete() {
  if (!book.value) {
    return
  }

  isDeleting.value = true
  errorMessage.value = ''
  try {
    const isDeleted = await deleteBook(book.value.id)

    if (!isDeleted) {
      errorMessage.value = "Le livre n'a pas pu être supprimé."
      return
    }

    emit('deleted', book.value)
    book.value = null
    showModal.value = false
  } catch (error) {
    errorMessage.value = getErrorMessage(error)
  } finally {
    isDeleting.value = false
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Une erreur est survenue pendant la suppression.'
}

defineExpose({ openModal })
</script>

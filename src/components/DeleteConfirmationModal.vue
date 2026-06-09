<template>
  <div v-if="book" class="modal">
    <div class="wrapper">
      <div class="modal-card-wrapper">
        <div class="modal-card delete-confirmation-card">
          <div class="modal-header">
            <p>Confirmation de suppression</p>
          </div>
          <hr />
          <div class="modal-body">
            <p>
              Voulez-vous vraiment supprimer le livre
              <strong>"{{ book.title }}"</strong> ?
            </p>
          </div>
          <hr />
          <div class="modal-footer">
            <button class="modal-button-delete" @click="emit('confirm')">Supprimer</button>
            <button class="modal-button" @click="emit('cancel')">Annuler</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Book } from '@/types/Book'

defineProps<{
  book: Book | null
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <div v-if="showModal" class="modal">
    <div class="wrapper">
      <div class="modal-card-wrapper">
        <div class="modal-card">
          <div class="modal-header">
            <p>Détails d'un livre</p>
          </div>
          <hr />
          <div class="modal-body">
            <div class="infos-wrapper">
              <div class="infos-row">
                <div class="row-2">
                  <div class="infos-legend">Titre</div>
                  <div class="infos-value">{{ book?.title }}</div>
                </div>
                <div class="row-2">
                  <div class="infos-legend">Catégorie</div>
                  <div class="infos-value">
                    <div class="pills-wrapper">
                      <PillComponent v-for="cat in book?.genre" :key="cat">
                        {{ cat }}
                      </PillComponent>
                    </div>
                  </div>
                </div>
              </div>
              <div class="infos-row">
                <div class="row-2">
                  <div class="infos-legend">Date de sortie</div>
                  <div class="infos-value">{{ releaseDate }}</div>
                </div>
                <div class="row-2">
                  <div class="infos-legend">Auteur</div>
                  <div class="infos-value">{{ book?.author }}</div>
                </div>
              </div>
              <div class="infos-row">
                <div class="row-full">
                  <div class="infos-legend">Description</div>
                  <div class="infos-value">
                    {{ book?.description }}
                  </div>
                </div>
              </div>
              <div class="infos-row">
                <div v-if="book?.rating !== undefined" class="row-2">
                  <div class="infos-legend">Note</div>
                  <div class="infos-value">
                    {{ book.rating.toFixed(2) }} <StarIcon class="icons" />
                  </div>
                </div>
                <div class="row-2">
                  <div class="infos-legend">Ajouter une note</div>
                  <div class="infos-value">
                    <input
                      v-model="newNote"
                      class="range"
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                    />
                    <p class="range-note">{{ newNote }}</p>
                    <button class="add-btn" @click="addNote">
                      <PlusIcon class="icon-add-btn" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div class="modal-footer">
            <button class="modal-button" @click="closeModal">Fermer</button>
            <button class="modal-button-delete">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Book } from '@/types/Book'
import { getBookById, updateNote } from '@/utils/Api'
import { StarIcon, PlusIcon } from '@heroicons/vue/24/outline'
import PillComponent from './commons/PillComponent.vue'
import { computed, ref } from 'vue'

const book = ref<Book | null>(null)

const showModal = ref<boolean>(false)

const releaseDate = computed(() => {
  const date = new Date(book.value?.releaseDate as string)
  return date.getFullYear()
})
const newNote = ref<string>('0')

function closeModal() {
  book.value = null
  showModal.value = false
}

async function openModal(newBook: number) {
  const resp = await getBookById(newBook)
  if (resp != null) {
    book.value = resp
    newNote.value = '0'
    showModal.value = true
  }
}

async function addNote() {
  if (book.value != undefined) {
    const note = await updateNote(book.value?.id, newNote.value)
    closeModal()
    if (note) emit('onSave', note)
  }
}

defineExpose({ openModal })
const emit = defineEmits<{
  (e: 'onSave', newNote: string): void
}>()
</script>

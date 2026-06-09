<template>
  <div v-if="showModal && book != undefined" class="modal">
    <div class="wrapper">
      <div class="modal-card-wrapper">
        <div class="modal-card">
          <div class="modal-header">
            <p>{{ titre }}</p>
          </div>
          <hr />
          <div class="modal-body">
            <div class="infos-wrapper">
              <div class="infos-row">
                <div class="row-2">
                  <div class="infos-legend">Titre</div>
                  <div class="infos-value">
                    <input v-model="book.title" class="input" type="text" />
                  </div>
                </div>
                <div class="row-2">
                  <div class="infos-legend">Auteur</div>
                  <div class="infos-value">
                    <input v-model="book.author" class="input" type="text" />
                  </div>
                </div>
              </div>
              <div class="infos-row">
                <div class="row-2">
                  <div class="infos-legend">Catégorie</div>
                  <div class="infos-value">
                    <div class="category-wrapper">
                      <input v-model="newGenre" type="text" class="input" />
                      <button class="add-btn" @click="addGenre">
                        <PlusIcon class="icon-add-btn" />
                      </button>
                    </div>
                  </div>
                </div>
                <div class="row-2">
                  <div class="pills-wrapper">
                    <PillComponent
                      v-for="cat in book?.genre"
                      :key="cat"
                      :category="cat"
                      @click="deleteCategory(cat)"
                    >
                      {{ cat }}
                    </PillComponent>
                  </div>
                </div>
              </div>
              <div class="infos-row">
                <div class="row-2">
                  <div class="infos-legend">Date de sortie</div>
                  <div class="infos-value">
                    <input v-model="book.releaseDate" type="date" class="input" />
                  </div>
                </div>
                <div class="row-2">
                  <div class="infos-legend">Note</div>
                  <div class="infos-value">
                    <input v-model.number="book.rating" type="number" min="0" class="input" />
                  </div>
                </div>
              </div>
              <div class="infos-row">
                <div class="row-2">
                  <div class="infos-legend">Ventes</div>
                  <div class="infos-value">
                    <input v-model.number="book.sales" type="number" min="0" class="input" />
                  </div>
                </div>
              </div>
              <div class="infos-row">
                <div class="row-full">
                  <div class="infos-legend">Description</div>
                  <div class="infos-value">
                    <textarea v-model="book.description" class="textarea" type="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div class="modal-footer">
            <button class="modal-button" style="background-color: #5fbf64" @click="saveBook">
              Valider
            </button>
            <button class="modal-button" @click="closeModal">Annuler</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineExpose, computed } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { Book } from '@/types/Book'
import PillComponent from './commons/PillComponent.vue'
import { createBook, updateBook } from '@/utils/Api'

const showModal = ref<boolean>(true)
const emit = defineEmits<{
  (e: 'book-saved'): void
}>()

function closeModal() {
  book.value = null
  showModal.value = false
}

const book = ref<Book | null>()

const titre = computed(() =>
  book.value?.id != 0 ? 'Modification du livre' : "Création d'un livre"
)

const newGenre = ref('')
function addGenre() {
  if (newGenre.value != '') {
    book.value?.genre.push(newGenre.value)
    newGenre.value = ''
  }
}

function deleteCategory(cat: string) {
  if (book.value) {
    book.value.genre = book.value?.genre.filter((genre) => {
      return cat !== genre
    })
  }
}

async function saveBook() {
  if (book.value) {
    let savedBook: Book | null

    if (book.value.id != 0) {
      savedBook = await updateBook(book.value)
    } else {
      savedBook = await createBook(book.value)
    }

    if (savedBook) {
      closeModal()
      emit('book-saved')
    }
  }
}

function openModal(newBook: Book | null) {
  book.value = newBook
  showModal.value = true
}

defineExpose({ openModal })
</script>

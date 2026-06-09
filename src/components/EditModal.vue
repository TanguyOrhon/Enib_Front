<template>
  <div v-if="showModal && editableBook != undefined" class="modal">
    <div class="wrapper" @click.self="cancelEdit">
      <div class="modal-card-wrapper">
        <div class="modal-card">
          <div class="modal-header">
            <p>{{ title }}</p>
          </div>
          <hr />
          <form @submit.prevent="saveBook">
            <div class="modal-body">
              <div class="infos-wrapper">
                <div class="infos-row">
                  <div class="row-2">
                    <div class="infos-legend">Titre</div>
                    <div class="infos-value">
                      <input v-model.trim="editableBook.title" class="input" type="text" />
                    </div>
                    <p v-if="errors.title" class="form-error">{{ errors.title }}</p>
                  </div>
                  <div class="row-2">
                    <div class="infos-legend">Auteur</div>
                    <div class="infos-value">
                      <input v-model.trim="editableBook.author" class="input" type="text" />
                    </div>
                    <p v-if="errors.author" class="form-error">{{ errors.author }}</p>
                  </div>
                </div>
                <div class="infos-row">
                  <div class="row-2">
                    <div class="infos-legend">Catégorie</div>
                    <div class="infos-value">
                      <div class="category-wrapper">
                        <input v-model.trim="newGenre" type="text" class="input" />
                        <button class="add-btn" type="button" @click="addGenre">
                          <PlusIcon class="icon-add-btn" />
                        </button>
                      </div>
                    </div>
                    <p v-if="errors.genre" class="form-error">{{ errors.genre }}</p>
                  </div>
                  <div class="row-2">
                    <div class="pills-wrapper">
                      <PillComponent
                        v-for="cat in editableBook.genre"
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
                      <input v-model="editableBook.releaseDate" type="date" class="input" />
                    </div>
                    <p v-if="errors.releaseDate" class="form-error">{{ errors.releaseDate }}</p>
                  </div>
                </div>
                <div class="infos-row">
                  <div class="row-full">
                    <div class="infos-legend">Description</div>
                    <div class="infos-value">
                      <textarea v-model.trim="editableBook.description" class="textarea" />
                    </div>
                    <p v-if="errors.description" class="form-error">{{ errors.description }}</p>
                  </div>
                </div>
                <p v-if="errors.form" class="form-error form-error-global">{{ errors.form }}</p>
              </div>
            </div>
            <hr />
            <div class="modal-footer">
              <button class="modal-button-success" type="submit" :disabled="isSaving">
                {{ isSaving ? 'Enregistrement...' : 'Valider' }}
              </button>
              <button class="modal-button" type="button" :disabled="isSaving" @click="cancelEdit">
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, toRaw } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { Book } from '@/types/Book'
import PillComponent from './commons/PillComponent.vue'
import { generateId } from '@/utils/Methods'
import { createBook, updateBook } from '@/utils/Api'

type FormErrors = Partial<
  Record<'title' | 'author' | 'releaseDate' | 'description' | 'genre' | 'form', string>
>

const emit = defineEmits<{
  (e: 'onSave', book: Book): void
}>()

const showModal = ref<boolean>(false)
const isSaving = ref<boolean>(false)
const editableBook = ref<Book | null>(null)
const newGenre = ref('')
const errors = ref<FormErrors>({})

const title = computed(() =>
  editableBook.value?.id != 0 ? 'Modification du livre' : "Création d'un livre"
)

onMounted(() => {
  window.addEventListener('keydown', closeOnEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', closeOnEscape)
})

function resetModalState() {
  editableBook.value = null
  newGenre.value = ''
  errors.value = {}
  isSaving.value = false
  showModal.value = false
}

function cancelEdit() {
  if (isSaving.value) {
    return
  }

  resetModalState()
}

function addGenre() {
  const genre = newGenre.value.trim()

  if (genre != '' && editableBook.value && !editableBook.value.genre.includes(genre)) {
    editableBook.value.genre.push(genre)
    newGenre.value = ''
    errors.value = { ...errors.value, genre: undefined }
  }
}

function deleteCategory(cat: string) {
  if (editableBook.value) {
    editableBook.value.genre = editableBook.value.genre.filter((genre) => cat !== genre)
  }
}

async function saveBook() {
  if (!editableBook.value) {
    return
  }

  const validationErrors = validateBook(editableBook.value)
  errors.value = validationErrors
  if (Object.keys(validationErrors).length > 0) {
    return
  }

  isSaving.value = true
  try {
    const payload = sanitizeBook(editableBook.value)
    const savedBook =
      payload.id != 0 ? await updateBook(payload) : await createBook({ ...payload, id: generateId() })

    if (savedBook == null) {
      errors.value = { form: "Le livre n'a pas pu être enregistré." }
      return
    }

    emit('onSave', normalizeBook(savedBook))
    resetModalState()
  } catch (error) {
    errors.value = { form: getErrorMessage(error) }
  } finally {
    isSaving.value = false
  }
}

function openModal(newBook: Book | null = null) {
  editableBook.value = newBook ? cloneBookForEditing(newBook) : createEmptyBook()
  newGenre.value = ''
  errors.value = {}
  isSaving.value = false
  showModal.value = true
}

defineExpose({ openModal })

function createEmptyBook(): Book {
  return {
    id: 0,
    title: '',
    author: '',
    releaseDate: '',
    description: '',
    genre: []
  }
}

function cloneBookForEditing(bookToClone: Book): Book {
  const rawBook = toRaw(bookToClone)

  try {
    const clonedBook = structuredClone(rawBook)
    return {
      ...clonedBook,
      genre: [...(clonedBook.genre ?? [])]
    }
  } catch {
    return {
      ...rawBook,
      genre: [...(rawBook.genre ?? [])]
    }
  }
}

function validateBook(bookToValidate: Book): FormErrors {
  const nextErrors: FormErrors = {}

  if (bookToValidate.title.trim() == '') {
    nextErrors.title = 'Le titre est obligatoire.'
  }

  if (bookToValidate.author.trim() == '') {
    nextErrors.author = "L'auteur est obligatoire."
  }

  if (bookToValidate.releaseDate.trim() == '') {
    nextErrors.releaseDate = 'La date de sortie est obligatoire.'
  }

  if (bookToValidate.description.trim() == '') {
    nextErrors.description = 'La description est obligatoire.'
  }

  if (bookToValidate.genre.length == 0) {
    nextErrors.genre = 'Ajoutez au moins une catégorie.'
  }

  return nextErrors
}

function sanitizeBook(bookToSanitize: Book): Book {
  return {
    ...bookToSanitize,
    title: bookToSanitize.title.trim(),
    author: bookToSanitize.author.trim(),
    releaseDate: bookToSanitize.releaseDate,
    description: bookToSanitize.description.trim(),
    genre: bookToSanitize.genre.map((genre) => genre.trim()).filter((genre) => genre != '')
  }
}

function normalizeBook(bookToNormalize: Book): Book {
  return {
    ...bookToNormalize,
    releaseDate: bookToNormalize.releaseDate ? bookToNormalize.releaseDate.slice(0, 10) : ''
  }
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return "Une erreur est survenue lors de l'enregistrement."
}

function closeOnEscape(event: KeyboardEvent) {
  if (event.key == 'Escape' && showModal.value) {
    cancelEdit()
  }
}
</script>

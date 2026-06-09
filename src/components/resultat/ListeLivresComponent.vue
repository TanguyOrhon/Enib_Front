<template>
  <div>
    <div class="list-actions">
      <button class="create-book-button" type="button" @click="openCreateModal">
        <PlusIcon class="create-book-icon" />
        Ajouter un livre
      </button>
    </div>
    <div v-if="isReady && listbook.length > 0" class="list-wrapper">
      <div v-for="book in bookShown" :key="book.id" class="result-wrapper">
        <div class="select-wrapper">
          <input type="checkbox" class="select" />
        </div>
        <CardBookComponent
          :book="book"
          @view-book="openBookDetails"
          @update-book="openBookModal"
          @delete-book="openDeleteModal"
        />
      </div>
    </div>
    <div v-else-if="isReady && listbook.length < 1" class="nobook_msg">
      <div class="icon-wrapper">
        <FaceFrownIcon class="icons" />
      </div>
      <p>Aucune référence ne coïncide avec votre recherche</p>
    </div>
    <PaginationComponent
      v-if="isReady"
      :current-page="currentPage"
      :total-pages="totalPages"
      :items-per-page="itemsPerPage"
      :items-per-page-options="itemsPerPageOptions"
      @change-page="changePage"
      @change-items-per-page="changeItemsPerPage"
    />
    <EditModal ref="edit" @on-save="saveBookInList" />
    <DeleteBookModal ref="deleteModal" @deleted="deleteBookFromList" />
    <BookDetailsModal
      :book="selectedBook"
      :is-open="isDetailsModalOpen"
      @close="closeBookDetails"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { Book } from '@/types/Book'
import { getBookdWithAuthor, getBooks } from '@/utils/Api'
import CardBookComponent from './CardBookComponent.vue'
import PaginationComponent from './PaginationComponent.vue'
import { Columns } from '@/types/Columns'
import { Order } from '@/types/Order'
import { FaceFrownIcon, PlusIcon } from '@heroicons/vue/24/outline'
import EditModal from '../EditModal.vue'
import DeleteBookModal from '../DeleteBookModal.vue'
import BookDetailsModal from '../BookDetailsModal.vue'

const listbook = ref<Array<Book>>([])
const isReady = ref<boolean>(false)
const itemsPerPageOptions = [20, 50, 100]
const itemsPerPage = ref<number>(20)
const currentPage = ref<number>(1)
const totalPages = computed(() => Math.max(1, Math.ceil(listbook.value.length / itemsPerPage.value)))
const edit = ref<null | InstanceType<typeof EditModal>>()
const deleteModal = ref<null | InstanceType<typeof DeleteBookModal>>()
const selectedBook = ref<Book | null>(null)
const isDetailsModalOpen = ref<boolean>(false)

const bookShown = computed(() =>
  listbook.value.slice(
    itemsPerPage.value * (currentPage.value - 1),
    itemsPerPage.value * currentPage.value
  )
)

watch([totalPages, currentPage], () => {
  keepCurrentPageValid()
})

onMounted(async () => {
  await loadBooks()
})

const loadBooks = async () => {
  isReady.value = false
  const resp = await getBooks()
  if (resp != null) {
    listbook.value = resp
  }
  isReady.value = true
  await nextTick()
}

function openBookModal(book: Book) {
  edit.value?.openModal(book)
}

function openCreateModal() {
  edit.value?.openModal(null)
}

function openBookDetails(book: Book) {
  selectedBook.value = book
  isDetailsModalOpen.value = true
}

function closeBookDetails() {
  isDetailsModalOpen.value = false
  selectedBook.value = null
}

function openDeleteModal(book: Book) {
  deleteModal.value?.openModal(book)
}

function saveBookInList(savedBook: Book) {
  const bookIndex = listbook.value.findIndex((book) => book.id == savedBook.id)

  if (bookIndex >= 0) {
    listbook.value.splice(bookIndex, 1, savedBook)
  } else {
    listbook.value.unshift(savedBook)
    currentPage.value = 1
  }
  keepCurrentPageValid()
}

function deleteBookFromList(deletedBook: Book) {
  listbook.value = listbook.value.filter((book) => book.id != deletedBook.id)
  keepCurrentPageValid()
}

async function loadBooksWithAuthor(author: string) {
  isReady.value = false
  const resp = await getBookdWithAuthor(author)
  if (resp != null) {
    listbook.value = resp
  }
  isReady.value = true
  await nextTick()
}

function changePage(newPage: number) {
  currentPage.value = clampPage(newPage)
}

function changeItemsPerPage(newItemsPerPage: number) {
  if (itemsPerPageOptions.includes(newItemsPerPage)) {
    itemsPerPage.value = newItemsPerPage
    keepCurrentPageValid()
  }
}

function clampPage(newPage: number) {
  return Math.min(Math.max(newPage, 1), totalPages.value)
}

function keepCurrentPageValid() {
  currentPage.value = clampPage(currentPage.value)
}

function sortList(column: Columns, order: Order) {
  let col: keyof Book = 'title'
  switch (column) {
    case Columns.TITLE:
      col = 'title'
      break
    case Columns.DATE:
      col = 'releaseDate'
      break
  }
  listbook.value = listbook.value.sort((a, b) => {
    if (order == Order.ASC) {
      return a[col] > b[col] ? 1 : -1
    } else {
      return a[col] > b[col] ? -1 : 1
    }
  })
}

defineExpose({ sortList, loadBooksWithAuthor, loadBooks })
</script>

<template>
  <div>
    <div class="add-book-wrapper">
      <button class="add-book-button" @click="openCreateModal">Ajouter un livre</button>
    </div>
    <div v-if="isReady && listbook.length > 0" class="list-wrapper">
      <div v-for="book in bookShown" :key="book.id" class="result-wrapper">
        <div class="select-wrapper">
          <input type="checkbox" class="select" />
        </div>
        <CardBookComponent
          :book="book"
          @view-book="openDetailsModal"
          @update-book="openBookModal"
          @delete-book="openDeleteConfirmation"
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
      v-if="listbook.length > 0"
      :page="page"
      :page-max="pageMax"
      :page-size="pageSize"
      @change-page="changePage"
      @change-page-size="changePageSize"
    />
    <EditModal ref="edit" @book-saved="loadBooks" />
    <BookModal :book="selectedBookDetails" @close="closeDetailsModal" />
    <DeleteConfirmationModal
      :book="bookToDelete"
      @cancel="cancelDelete"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { Book } from '@/types/Book'
import { deleteBook, getBooks } from '@/utils/Api'
import { BookFilters } from '@/types/BookFilters'
import CardBookComponent from './CardBookComponent.vue'
import PaginationComponent from './PaginationComponent.vue'
import { Columns } from '@/types/Columns'
import { Order } from '@/types/Order'
import { FaceFrownIcon } from '@heroicons/vue/24/outline'
import EditModal from '../EditModal.vue'
import BookModal from '../BookModal.vue'
import DeleteConfirmationModal from '../DeleteConfirmationModal.vue'

const listbook = ref<Array<Book>>([])
const allBooks = ref<Array<Book>>([])
const isReady = ref<boolean>(false)
const pageSize = ref<number>(20)
const page = ref<number>(1)
const pageMax = computed(() => Math.ceil(listbook.value.length / pageSize.value))
const edit = ref<null | InstanceType<typeof EditModal>>()
const selectedBookDetails = ref<Book | null>(null)
const bookToDelete = ref<Book | null>(null)
const activeFilters = ref<BookFilters>({
  author: '',
  title: '',
  releaseDate: ''
})
const activeSort = ref<{ column: Columns; order: Order } | null>(null)

const bookShown = computed(() =>
  listbook.value.slice(pageSize.value * (page.value - 1), pageSize.value * page.value)
)

onMounted(() => {
  loadBooks()
  isReady.value = true
})

const loadBooks = async () => {
  isReady.value = false
  page.value = 1
  const resp = await getBooks()
  if (resp != null) {
    allBooks.value = resp
    filterBooks()
  }
  isReady.value = true
  await nextTick()
}

function openBookModal(book: Book) {
  edit.value?.openModal(book)
}

function openCreateModal() {
  edit.value?.openModal({
    id: 0,
    title: '',
    author: '',
    description: '',
    genre: [],
    releaseDate: '',
    rating: 0,
    sales: 0
  })
}

function openDetailsModal(book: Book) {
  selectedBookDetails.value = book
}

function closeDetailsModal() {
  selectedBookDetails.value = null
}

function openDeleteConfirmation(book: Book) {
  bookToDelete.value = book
}

function cancelDelete() {
  bookToDelete.value = null
}

async function confirmDelete() {
  if (!bookToDelete.value) {
    return
  }

  const deletedBookId = bookToDelete.value.id
  const isDeleted = await deleteBook(deletedBookId)

  if (isDeleted) {
    allBooks.value = allBooks.value.filter((book) => book.id !== deletedBookId)
    filterBooks()
    page.value = Math.min(page.value, Math.max(pageMax.value, 1))
    bookToDelete.value = null
  }
}

function applyFilters(filters: BookFilters) {
  activeFilters.value = {
    author: filters.author.trim(),
    title: filters.title.trim(),
    releaseDate: filters.releaseDate
  }
  page.value = 1
  filterBooks()
}

function filterBooks() {
  const author = activeFilters.value.author.toLocaleLowerCase()
  const title = activeFilters.value.title.toLocaleLowerCase()
  const releaseDate = activeFilters.value.releaseDate

  listbook.value = allBooks.value.filter((book) => {
    const matchesAuthor = !author || book.author.toLocaleLowerCase().includes(author)
    const matchesTitle = !title || book.title.toLocaleLowerCase().includes(title)
    const matchesDate = !releaseDate || book.releaseDate.slice(0, 10) === releaseDate

    return matchesAuthor && matchesTitle && matchesDate
  })

  if (activeSort.value) {
    sortBooks(activeSort.value.column, activeSort.value.order)
  }
}

function changePage(newPage: number) {
  page.value = newPage
}

function changePageSize(newPageSize: number) {
  pageSize.value = newPageSize
  page.value = 1
}

function sortList(column: Columns, order: Order) {
  activeSort.value = { column, order }
  sortBooks(column, order)
  page.value = 1
}

function sortBooks(column: Columns, order: Order) {
  listbook.value = [...listbook.value].sort((a, b) => {
    let comparison = 0

    switch (column) {
      case Columns.TITLE:
        comparison = a.title.localeCompare(b.title)
        break

      case Columns.DATE:
        comparison = new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
        break
    }

    return order === Order.ASC ? comparison : -comparison
  })
}

defineExpose({ sortList, applyFilters, loadBooks, openCreateModal })
</script>

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
        <CardBookComponent :book="book" @update-book="openBookModal" />
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
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { Book } from '@/types/Book'
import { getBookdWithAuthor, getBooks } from '@/utils/Api'
import CardBookComponent from './CardBookComponent.vue'
import PaginationComponent from './PaginationComponent.vue'
import { Columns } from '@/types/Columns'
import { Order } from '@/types/Order'
import { FaceFrownIcon } from '@heroicons/vue/24/outline'
import EditModal from '../EditModal.vue'

const listbook = ref<Array<Book>>([])
const isReady = ref<boolean>(false)
const pageSize = ref<number>(20)
const page = ref<number>(1)
const pageMax = computed(() => Math.ceil(listbook.value.length / pageSize.value))
const edit = ref<null | InstanceType<typeof EditModal>>()

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
    listbook.value = resp
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

async function loadBooksWithAuthor(author: string) {
  isReady.value = false
  page.value = 1
  const resp = await getBookdWithAuthor(author)
  if (resp != null) {
    listbook.value = resp
  }
  isReady.value = true
  await nextTick()
}

function changePage(newPage: number) {
  page.value = newPage
}

function changePageSize(newPageSize: number) {
  pageSize.value = newPageSize
  page.value = 1
}

function sortList(column: Columns, order: Order) {
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

  page.value = 1
}

defineExpose({ sortList, loadBooksWithAuthor, loadBooks, openCreateModal })
</script>

<template>
  <div>
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
    <PaginationComponent v-if="pageMax > 1" :page-max="pageMax" @change-page="changePage" />
    <EditModal ref="edit" />
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
const nb_book_shown = ref<number>(10)
const page = ref<number>(1)
const pageMax = computed(() => Math.ceil(listbook.value.length / nb_book_shown.value))
const edit = ref<null | InstanceType<typeof EditModal>>()

const bookShown = computed(() =>
  listbook.value.slice(nb_book_shown.value * (page.value - 1), nb_book_shown.value * page.value)
)

onMounted(() => {
  loadBooks()
  isReady.value = true
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
  page.value = newPage
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

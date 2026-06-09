<template>
  <div>
    <HeaderListComponent @change-order="sortList" />
    <ListeLivresComponent ref="list" />
  </div>
</template>

<script setup lang="ts">
import ListeLivresComponent from '@/components/resultat/ListeLivresComponent.vue'
import HeaderListComponent from '@/components/resultat/HeaderListComponent.vue'
import { ref } from 'vue'
import { Columns } from '@/types/Columns'
import { Order } from '@/types/Order'

const list = ref<null | InstanceType<typeof ListeLivresComponent>>()

function sortList(column: Columns, order: Order) {
  list.value?.sortList(column, order)
}

function searchAuthor(author: string) {
  if (author) {
    list.value?.loadBooksWithAuthor(author)
  } else {
    list.value?.loadBooks()
  }
}

defineExpose({ searchAuthor })
</script>

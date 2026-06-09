<template>
  <div class="header-list">
    <div class="xs"></div>
    <div class="sm">
      <OrderableHeader ref="title" :column="Columns.TITLE" @order-list="changeOrder">
        Titre
      </OrderableHeader>
    </div>
    <div class="md">Auteur</div>
    <div class="md">
      <OrderableHeader ref="date" :column="Columns.DATE" @order-list="changeOrder">
        Date de sortie
      </OrderableHeader>
    </div>
    <div class="sm">Note</div>
    <div class="xs"></div>
  </div>
</template>

<script lang="ts" setup>
import { Columns } from '@/types/Columns'
import { Order } from '@/types/Order'
import OrderableHeader from './OrderableHeader.vue'
import { ref } from 'vue'

const title = ref<null | InstanceType<typeof OrderableHeader>>()
const date = ref<null | InstanceType<typeof OrderableHeader>>()

const emit = defineEmits<{
  (e: 'changeOrder', column: Columns, order: Order): void
}>()

function changeOrder(column: Columns, order: Order) {
  switch (column) {
    case Columns.DATE:
      title.value?.resetState()
      break
    case Columns.TITLE:
      date.value?.resetState()
  }
  emit('changeOrder', column, order)
}
</script>

<template>
  <button class="header-btn-wrapper" @click="updateState">
    <slot></slot>
    <ChevronUpIcon v-if="state == Order.ASC" class="icon-header-btn" />
    <ChevronDownIcon v-else-if="state == Order.DESC" class="icon-header-btn" />
  </button>
</template>

<script lang="ts" setup>
import { Columns } from '@/types/Columns'
import { Order } from '@/types/Order'
import { ref } from 'vue'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  column: Columns
}>()

const state = ref<Order>(Order.NONE)

function updateState() {
  switch (state.value) {
    case Order.NONE:
      state.value = Order.ASC
      break
    case Order.ASC:
      state.value = Order.DESC
      break
    case Order.DESC:
      state.value = Order.ASC
      break
    default:
      state.value = Order.NONE
      break
  }

  if (state.value != Order.NONE) emit('orderList', props.column, state.value)
}

function resetState() {
  state.value = Order.NONE
}

const emit = defineEmits<{
  (e: 'orderList', column: Columns, order: Order): void
}>()

defineExpose({ resetState })
</script>

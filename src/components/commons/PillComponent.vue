<template>
  <div class="pill-wrapper" :style="categoryStyle">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { getCategoryColor } from '@/utils/CategoryColors'

const props = defineProps<{
  category?: string
}>()

const categoryStyle = computed(() => {
  return getCategoryColor(props.category)
})
</script>

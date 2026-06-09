<template>
  <div class="pill-wrapper" :style="{ backgroundColor: activeColor }">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  category: string
}>()

const activeColor = computed(() => {
  let hash = 0
  const categoryName = props.category.toLowerCase()
  for (let i = 0; i < categoryName.length; i++) {
    hash = categoryName.charCodeAt(i) + ((hash << 5) - hash)
  }

  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 65%, 45%)`
})
</script>

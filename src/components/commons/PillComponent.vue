<template>
  <div
    class="pill-wrapper"
    :style="{ backgroundColor: activeColor.background, color: activeColor.text }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  category: string
}>()

const colors = [
  { background: '#DC2626', text: '#FFFFFF' },
  { background: '#EA580C', text: '#FFFFFF' },
  { background: '#FACC15', text: '#422006' },
  { background: '#16A34A', text: '#FFFFFF' },
  { background: '#0D9488', text: '#FFFFFF' },
  { background: '#2563EB', text: '#FFFFFF' },
  { background: '#7C3AED', text: '#FFFFFF' },
  { background: '#DB2777', text: '#FFFFFF' }
]

const activeColor = computed(() => {
  const normalizedCategory = props.category.trim().toLowerCase()
  let hash = 0

  for (const character of normalizedCategory) {
    hash = (hash * 31 + character.charCodeAt(0)) | 0
  }

  return colors[Math.abs(hash) % colors.length]
})
</script>

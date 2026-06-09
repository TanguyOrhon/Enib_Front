<template>
  <div class="pill-wrapper" :style="{ backgroundColor: activeColor }">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const activeColor = computed(() => {
  return '#29B6F6'
})
</script>

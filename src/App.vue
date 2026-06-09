<template>
  <div>
    <NavbarComponent />
    <div class="body">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavbarComponent from './components/NavbarComponent.vue'
import { RouterView } from 'vue-router'

// onMounted(() => {
//   getBooks()
// })
</script>

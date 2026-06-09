<template>
  <div class="search-wrapper">
    <input
      v-model="name"
      type="text"
      class="search-input"
      placeholder="Recherchez l'auteur d'un livre"
    />
    <button class="search-button">Recherche</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const name = ref('')
</script>

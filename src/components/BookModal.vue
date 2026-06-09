<template>
  <div v-if="book" class="modal">
    <div class="wrapper">
      <div class="modal-card-wrapper">
        <div class="modal-card">
          <div class="modal-header">
            <p>Détails du livre</p>
          </div>
          <hr />
          <div class="modal-body">
            <div class="infos-wrapper">
              <div class="infos-row">
                <div class="row-2">
                  <div class="infos-legend">Titre</div>
                  <div class="infos-value">{{ book.title }}</div>
                </div>
                <div class="row-2">
                  <div class="infos-legend">Auteur</div>
                  <div class="infos-value">{{ book.author }}</div>
                </div>
              </div>
              <div class="infos-row">
                <div class="row-2">
                  <div class="infos-legend">Date de sortie</div>
                  <div class="infos-value">{{ book.releaseDate }}</div>
                </div>
                <div class="row-2">
                  <div class="infos-legend">Note</div>
                  <div class="infos-value">
                    {{ formatRating(book.rating) }}
                    <StarIcon v-if="book.rating !== undefined" class="icons" />
                  </div>
                </div>
              </div>
              <div class="infos-row">
                <div class="row-2">
                  <div class="infos-legend">Ventes</div>
                  <div class="infos-value">{{ book.sales ?? 0 }}</div>
                </div>
                <div class="row-2">
                  <div class="infos-legend">Catégories</div>
                  <div class="infos-value">
                    <div class="pills-wrapper">
                      <PillComponent v-for="category in book.genre" :key="category" :category="category">
                        {{ category }}
                      </PillComponent>
                    </div>
                  </div>
                </div>
              </div>
              <div class="infos-row">
                <div class="row-full">
                  <div class="infos-legend">Description</div>
                  <div class="infos-value">{{ book.description }}</div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div class="modal-footer">
            <button class="modal-button" @click="emit('close')">Fermer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Book } from '@/types/Book'
import { StarIcon } from '@heroicons/vue/24/outline'
import PillComponent from './commons/PillComponent.vue'

defineProps<{
  book: Book | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function formatRating(rating?: number) {
  return rating !== undefined ? rating.toFixed(2) : 'NN'
}
</script>

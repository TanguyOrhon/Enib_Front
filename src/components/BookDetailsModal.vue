<template>
  <div v-if="isOpen && book" class="modal">
    <div class="wrapper">
      <div class="modal-card-wrapper">
        <div
          class="modal-card book-details-modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="book-details-title"
        >
          <div class="modal-header book-details-header">
            <p id="book-details-title">{{ displayValue(book.title) }}</p>
          </div>
          <hr />
          <div class="modal-body">
            <div class="infos-wrapper">
              <div class="infos-row">
                <div class="row-2">
                  <div class="infos-legend">Titre</div>
                  <div class="infos-value">{{ displayValue(book.title) }}</div>
                </div>
                <div class="row-2">
                  <div class="infos-legend">Auteur</div>
                  <div class="infos-value">{{ displayValue(book.author) }}</div>
                </div>
              </div>
              <div class="infos-row">
                <div class="row-2">
                  <div class="infos-legend">Année de sortie</div>
                  <div class="infos-value">{{ releaseYear }}</div>
                </div>
                <div class="row-2">
                  <div class="infos-legend">Note</div>
                  <div class="infos-value">
                    {{ rating }}
                    <StarIcon v-if="book.rating !== undefined" class="icons" />
                  </div>
                </div>
              </div>
              <div class="infos-row">
                <div class="row-2">
                  <div class="infos-legend">Catégories</div>
                  <div class="infos-value">
                    <div v-if="book.genre.length > 0" class="pills-wrapper">
                      <PillComponent v-for="cat in book.genre" :key="cat" :category="cat">
                        {{ cat }}
                      </PillComponent>
                    </div>
                    <span v-else>-</span>
                  </div>
                </div>
                <div class="row-2">
                  <div class="infos-legend">Ventes</div>
                  <div class="infos-value">{{ displayValue(book.sales) }}</div>
                </div>
              </div>
              <div class="infos-row">
                <div class="row-full">
                  <div class="infos-legend">Description</div>
                  <div class="infos-value book-details-description">
                    {{ displayValue(book.description) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div class="modal-footer">
            <button class="modal-button" type="button" @click="emit('close')">Fermer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { StarIcon } from '@heroicons/vue/24/outline'
import { Book } from '@/types/Book'
import { formatReleaseYear, noteTo3Dec } from '@/utils/Methods'
import PillComponent from './commons/PillComponent.vue'

const props = defineProps<{
  book: Book | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const releaseYear = computed(() => formatReleaseYear(props.book?.releaseDate))
const rating = computed(() =>
  props.book?.rating !== undefined ? noteTo3Dec(props.book.rating) : '-'
)

function displayValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') {
    return '-'
  }

  if (typeof value == 'string' && value.trim() == '') {
    return '-'
  }

  return value
}
</script>

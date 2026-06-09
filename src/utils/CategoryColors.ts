type CategoryColor = {
  backgroundColor: string
  color: string
}

const defaultCategoryColor: CategoryColor = {
  backgroundColor: '#64748b',
  color: '#ffffff'
}

const categoryPalette: CategoryColor[] = [
  { backgroundColor: '#2563eb', color: '#ffffff' },
  { backgroundColor: '#0f766e', color: '#ffffff' },
  { backgroundColor: '#9333ea', color: '#ffffff' },
  { backgroundColor: '#c2410c', color: '#ffffff' },
  { backgroundColor: '#be123c', color: '#ffffff' },
  { backgroundColor: '#047857', color: '#ffffff' },
  { backgroundColor: '#7c3aed', color: '#ffffff' },
  { backgroundColor: '#b45309', color: '#ffffff' },
  { backgroundColor: '#0369a1', color: '#ffffff' },
  { backgroundColor: '#4338ca', color: '#ffffff' },
  { backgroundColor: '#a21caf', color: '#ffffff' },
  { backgroundColor: '#15803d', color: '#ffffff' },
  { backgroundColor: '#b91c1c', color: '#ffffff' },
  { backgroundColor: '#0e7490', color: '#ffffff' },
  { backgroundColor: '#6d28d9', color: '#ffffff' },
  { backgroundColor: '#9a3412', color: '#ffffff' }
]

export function getCategoryColor(category: string | undefined | null): CategoryColor {
  const normalizedCategory = category?.trim().toLowerCase()

  if (!normalizedCategory) {
    return defaultCategoryColor
  }

  return categoryPalette[hashCategory(normalizedCategory) % categoryPalette.length]
}

function hashCategory(category: string) {
  let hash = 0

  for (let index = 0; index < category.length; index++) {
    hash = (hash * 31 + category.charCodeAt(index)) >>> 0
  }

  return hash
}

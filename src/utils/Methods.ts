export function noteTo3Dec(note: number) {
  return (Math.floor(note * 1000) / 1000).toString()
}

export function generateId() {
  return Math.floor(Math.random() * (10000 - 300 + 1) + 200)
}

export function formatReleaseYear(dateValue: string | number | Date | null | undefined) {
  const fallbackValue = '-'

  if (dateValue == null || dateValue === '') {
    return fallbackValue
  }

  if (dateValue instanceof Date) {
    return Number.isNaN(dateValue.getTime()) ? fallbackValue : dateValue.getFullYear().toString()
  }

  const parsedDate = new Date(dateValue)
  if (Number.isNaN(parsedDate.getTime())) {
    return fallbackValue
  }

  if (typeof dateValue == 'string') {
    const yearMatch = dateValue.trim().match(/^(\d{4})/)
    return yearMatch ? yearMatch[1] : parsedDate.getFullYear().toString()
  }

  return parsedDate.getFullYear().toString()
}

export function normalizeSearchValue(value: string | number | null | undefined) {
  if (value == null) {
    return ''
  }

  return value
    .toString()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function normalizeDateValue(dateValue: string | number | Date | null | undefined) {
  if (dateValue == null || dateValue === '') {
    return ''
  }

  if (dateValue instanceof Date) {
    return Number.isNaN(dateValue.getTime()) ? '' : dateValue.toISOString().slice(0, 10)
  }

  if (typeof dateValue == 'string') {
    const dateMatch = dateValue.trim().match(/^(\d{4}-\d{2}-\d{2})/)
    if (dateMatch) {
      return dateMatch[1]
    }
  }

  const parsedDate = new Date(dateValue)
  return Number.isNaN(parsedDate.getTime()) ? '' : parsedDate.toISOString().slice(0, 10)
}

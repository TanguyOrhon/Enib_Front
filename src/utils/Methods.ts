export function noteTo3Dec(note: number) {
  return (Math.floor(note * 1000) / 1000).toString()
}

export function generateId() {
  return Math.floor(Math.random() * (10000 - 300 + 1) + 200)
}

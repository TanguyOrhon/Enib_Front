import { Book } from '@/types/Book'
import axios from 'axios'
import { noteTo3Dec } from './Methods'

const base = 'http://localhost:8080/books'

export async function getBooks(): Promise<Book[] | null> {
  const resp = await axios.get(base)
  if (resp.status == 200) {
    const list = resp.data as Book[]
    list.map((val) => (val.releaseDate = val.releaseDate.slice(0, 10)))
    return list
  } else {
    return null
  }
}

export async function getBookdWithAuthor(author: string): Promise<Book[] | null> {
  const resp = await axios.get(base + '/author?author=' + author)
  if (resp.status == 200) {
    return resp.data as Book[]
  } else {
    return null
  }
}

export async function getBookById(id: number): Promise<Book | null> {
  const url = base + '/id/' + id
  const resp = await axios.get(url)
  if (resp.status == 200) {
    return resp.data as Book
  } else {
    console.error('Erreur lors de la récupération du livre ' + id)
    return null
  }
}

export async function updateNote(id: number, newNote: string): Promise<string | null> {
  const book = await getBookById(id)
  if (book != null) {
    let newRate: number
    if (book.rating != undefined && book.sales != undefined) {
      newRate = (book.rating * book.sales + Number.parseFloat(newNote)) / (book.sales + 1)
      book.sales++
    } else {
      newRate = Number.parseFloat(newNote)
      book.sales = 1
    }

    const resp = await axios.patch(base + '/id/' + id + '?rating=' + newRate)
    if (resp.status != 200) {
      console.warn('Erreur lors de la mise à jour de la note')
    } else {
      return noteTo3Dec(newRate)
    }
  }
  return null
}

export async function getNoteById(id: number) {
  const book = await getBookById(id)
  return book && book.rating ? book.rating.toFixed(2) : 'NN'
}

export async function createBook(book: Book) {
  const url = base
  const resp = await axios.post(url, JSON.stringify(book), {
    headers: { 'Content-Type': 'application/json' }
  })
  if (resp.status == 200) {
    return resp.data as Book
  } else {
    console.error('Erreur lors de la création du livre')
    return null
  }
}

export async function updateBook(book: Book) {
  const url = base + '/id/' + book.id
  const resp = await axios.put(url, JSON.stringify(book), {
    headers: { 'Content-Type': 'application/json' }
  })
  if (resp.status == 200) {
    return resp.data as Book
  } else {
    console.error('Erreur lors de la mise à jour du livre')
    return null
  }
}

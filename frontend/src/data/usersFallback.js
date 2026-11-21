const users = [
  { id: 1, firstName: 'Vanderson', lastName: 'Gabriel', username: 'vanderson.demo', email: 'vanderson@example.com', image: '' },
  { id: 2, firstName: 'Pedro', lastName: 'Vinicius', username: 'pedro.demo', email: 'pedro@example.com', image: '' },
  { id: 3, firstName: 'Emanuela', lastName: '', username: 'emanuela.demo', email: 'emanuela@example.com', image: '' }
]

export const usersFallback = { users, total: users.length, skip: 0, limit: users.length }

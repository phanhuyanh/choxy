import IDBIndex from './IDBIndex.js'

class IDBObjectStore {
  #objectStore
  constructor(objectStore) {
    this.#objectStore = objectStore
    this.queue = []
  }
  async add(record) {
    let request = this.#objectStore.add(record)

    return new Promise((res, rej) => {
      request.onerror = evt => {
        console.error(`Error add record to table ${this.#objectStore.name}: `, evt.error)
        rej(false)
      }
      request.onsuccess = _ => res(true)
    })
  }
  async clear() {
    let request = this.#objectStore.clear()

    return new Promise((res, rej) => {
      request.onerror = evt => {
        console.error(`Error clear all record of table ${this.#objectStore.name}: `, evt.error)
        rej(false)
      }
      request.onsuccess = _ => res(true)
    })
  }
  async count() {
    let request = this.#objectStore.count()

    return new Promise((res, rej) => {
      request.onerror = evt => {
        console.error(`Error count record of table ${this.#objectStore.name}: `, evt.error)
        rej(false)
      }
      request.onsuccess = evt => res(evt.target.result)
    })
  }
  async delete(id) {
    let request = this.#objectStore.delete(id)

    return new Promise((res, rej) => {
      request.onerror = evt => {
        console.error(`Error delete record in table ${this.#objectStore.name}: `, evt.error)
        rej(false)
      }
      request.onsuccess = _ => res(true)
    })
  }
  async get(id) {
    let request = this.#objectStore.get(id)

    return new Promise((res, rej) => {
      request.onerror = evt => {
        console.error(`Error get a record from table ${this.#objectStore.name}: `, evt.error)
        rej(false)
      }
      request.onsuccess = evt => res(evt.target.result)
    })
  }
  async update(id, record) {
    let request = this.#objectStore.put(record, id)
    
    return new Promise((res, rej) => {
      request.onerror = evt => {
        console.error(`Error update record from table ${this.#objectStore.name}: `, evt.error)
        rej(false)
      }
      request.onsuccess = _ => res(true)
    })
  }
  getAll() {
    this.state = 'get_all'
    return this
  }
  offset(start, end) {
    this.queue.push({key: 'offset', value: {start, end}})
    return this
  }
  limit(count) {
    this.queue.push({key: 'limit', value: count})
    return this
  }
  sortBy(cb) {
    this.queue.push({key: 'sort', value: cb})
    return this
  }
  async toArray() {
    let request = this.#objectStore.getAll()

    return new Promise((res, rej) => {
      request.onerror = evt => {
        console.error(`Error get all record from table ${this.#objectStore.name}: `, evt.error)
        rej([])
      }
      request.onsuccess = evt => {
        let r = evt.target.result

        this.queue.map(({key, value}) => {
          switch (key) {
            case 'offset':
              r = r.slice(value.start, value.end)
              break
            case 'limit':
              r = r.slice(0, value)
              break
            case 'sort':
              r = r.sort((a,b) => value(a,b))
              break
          }
        })

        this.queue = []
        res(r)
      }
    })
  }
  forEach(cb) {
    let request = this.#objectStore.openCursor()
    request.onsuccess = evt => {
      let cursor = evt.target.result
      if(cursor) {
        cb({key: cursor.key, value: cursor.value})
        cursor.continue()
      }
    }
  }
  where(index) {
    if(index === this.#objectStore.keyPath) return console.error(`Must specific index diff id`)
    let idbIndex = this.#objectStore.index(index)
    return new IDBIndex(idbIndex)
  }
}

export default IDBObjectStore
import { isObject } from './common.js'

const indexedDB = window.indexedDB

class IDBOpenRequest {
  #super
  constructor(that, name, version) {
    this.#super = that
    this.version = version
    this.name = name
  }
  async create(schema) {
    if(!isObject(schema)) {
      console.error('Schema require is object')
      return Promise.reject(false)
    }

    let request = indexedDB.open(this.name, this.version)

    request.onupgradeneeded = evt => {
      let db = evt.target.result

      for(let table in schema) {
        let fields = schema[table]
        let [id, ...rest] = fields.split`,`.map(e => e.trim())
        let objectStore = db.createObjectStore(table, id === '++id' ? { autoIncrement : true } : { keyPath: id })
        
        rest.map(field => {
          let unique = field[0] === '&' ? true : false
          field = unique ? field.slice(1) : field
          objectStore.createIndex(field, field, { unique })
        })
      }
    }

    return new Promise((res, rej) => {
      request.onblocked = evt => {
        evt.target.result.close()
        console.error("Please close all other tabs with this site open!")
        rej(false)
      }

      request.onerror = evt => {
        console.error(`Error upgrade database ${this.name}: `, evt.error)
        rej(false)
      }

      request.onsuccess = evt => {
        this.#emit(evt.target.result)
        res(true)
      }
    })
  }
  async remove(objectStore) {
    if(typeof objectStore !== 'string' && !Array.isArray(objectStore)) return console.error(`name table must string`)

    let request = indexedDB.open(this.name, this.version)

    request.onupgradeneeded = evt => {
      let db = evt.target.result

      if(Array.isArray(objectStore)) {
        objectStore.map(objectStoreName => db.deleteObjectStore(objectStoreName))
        return
      }
      db.deleteObjectStore(objectStore)
    }

    return new Promise((res, rej) => {
      request.onerror = evt => {
        console.error(`Error delete table: `, evt.error)
        rej(false)
      }
      request.onsuccess = _ => res(true)
    })
  }
  #emit(db) {
    this.#super._on(db)
  }
}

export default IDBOpenRequest
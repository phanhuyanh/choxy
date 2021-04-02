import IDBOpenRequest from './IDBOpenRequest.js'
import IDBObjectStore from './IDBObjectStore.js'
import { isPositiveNumber } from './common.js'

const indexedDB = window.indexedDB

class IDB {
  constructor(name) {
    this.name = name
    this.db = null
  }
  version(version) {
    if(!isPositiveNumber(version)) return console.error(`Version must positive number`) 
    
    return new IDBOpenRequest(this, this.name, version)
  }
  async init() {
    let request = indexedDB.open(this.name)

    return new Promise((res, rej) => {
      request.onerror = evt => {
        console.error(`Error open database ${this.name}: `, evt.error)
        rej(false)
      }

      request.onblocked = evt => {
        evt.target.result.close()
        console.error("Please close all other tabs with this site open!")
        rej(false)
      }

      request.onsuccess = evt => {
        this.db = evt.target.result
        res(true)
      }
    })
  }
  query(objectStore) {
    objectStore = this.db.transaction(objectStore, 'readwrite').objectStore(objectStore)
    return new IDBObjectStore(objectStore)
  }
  _on(db) {
    this.db = db
  }
}

export default IDB
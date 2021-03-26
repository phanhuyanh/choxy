import { isObject } from './common.js'
const indexedDB = window.indexedDB

class IDB {
  #nameDatabase
  #version
  constructor(name, version, tables) {
    this.db = null
    this.#nameDatabase = name
    this.#version = version
    this.tables = tables
  }
  async init() {
    let request = indexedDB.open(this.#nameDatabase, this.#version)

    await new Promise((res, rej) => {
      request.onerror = evt => {
        this.#handleError(evt)
        rej(false)
      }
      request.onsuccess = async evt => {
        this.#handleSuccess(evt)
        res(true)
      }
      request.onupgradeneeded = evt => this.#handleUpgrade(evt)
    })
  }
  #handleError(evt) {
    console.error('Error open database', evt.target.errorCode)
  }
  #handleSuccess(evt) {
    this.db = evt.target.result
    this.#versionChange()
  }
  async #handleUpgrade(evt) {
    return await new Promise((res, rej) => {
      this.db = evt.target.result
      this.#versionChange()
      if(!isObject(this.tables)) return rej(false)

      for(let nameObjStore in this.tables) {
        let columns = this.tables[nameObjStore]
        if(typeof columns !== 'string') continue
        let [id, ...indexs] = columns.split`,`.map(e => e.trim())
        let objectStore = this.db.createObjectStore(nameObjStore, id === '++id' ? {autoIncrement: true} : {keyPath: id})

        indexs.map(index => {
          let isUnique = index[0] === '&'
          let name = isUnique ? index.slice(1) : index
          objectStore.createIndex(name, name, {unique: isUnique})
        })
      }
      res(true)
    })
  }
  async add(objectStore, data) {
    let request = this.db.transaction(objectStore, 'readwrite').objectStore(objectStore).add(data)
    let status = await new Promise((res, rej) => {
      request.onerror = evt => {
        console.error('Error add data to database: ', evt.target.errorCode)
        rej(false)
      }
      request.onsuccess = _ => res(true)
    })
    return status
  }
  async remove(objectStore, id) {
    let request = this.db.transaction(objectStore, 'readwrite').objectStore(objectStore).delete(id)
    let status = await new Promise((res, rej) => {
      request.onerror = evt => {
        console.error('Error delete entry from database: ', evt.target.errorCode)
        rej(false)
      }
      request.onsuccess = _ => res(true)
    })
    return status
  }
  async update(objectStore, id, data) {
    let objStore = this.db.transaction(objectStore, 'readwrite').objectStore(objectStore)
    let request = objStore.get(id)

    request.onerror = evt => console.error('Error get entry from database: ', objectStore)

    let status = await new Promise((res, rej) => {
      request.onsuccess = evt => {
        let requestUpdate = objStore.put(data)
        requestUpdate.onerror = evt => {
          console.error('Error update entry from database: ', evt.target.errorCode)
          rej(false)
        }
        requestUpdate.onsuccess = _ => res(true)
      }
    })
    return status
  }
  async get(objectStore, id) {
    let request = this.db.transaction(objectStore).objectStore(objectStore).get(id)
  
    let record = await new Promise((res, rej) => {
      request.onsuccess = evt => res(evt.target.result)
      request.onerror = evt => {
        console.error('Error get entry from database: ', evt.target.errorCode)
        rej(false)
      }
    })

    return record
  }
  async getAll(objectStore) {
    objectStore = this.db.transaction(objectStore).objectStore(objectStore)
    let records = await new Promise((res, rej) => {
      objectStore.getAll().onsuccess = evt => res(evt.target.result)
    })
    return records
  }
  cursor(objectStore, {IDBKeyRange, direction}, callback) {
    objectStore = this.db.transaction(objectStore).objectStore(objectStore)
    objectStore.openCursor(IDBKeyRange, direction).onsuccess = evt => {
      let cursor = evt.target.result
      if(cursor) {
        callback(cursor)
        cursor.continue()
      }
    }
  }
  async index(objectStore, name, value) {
    objectStore = this.db.transaction(objectStore).objectStore(objectStore)
    let index = objectStore.index(name)
    return await new Promise(res => index.get(value).onsuccess = evt => res(evt.target.result))
  }
  #versionChange() {
    this.db.onversionchange = _ => {
      this.db.close()
      alert("A new version of this page is ready. Please reload or close this tab!")
    }
  }
}

export default IDB
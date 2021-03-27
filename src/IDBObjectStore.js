import IDBIndex from './IDBIndex.js'

class IDBOjbectStore {
  objectStore
  constructor(objectStore) {
    this.objectStore = objectStore
  }
}

IDBOjbectStore.prototype.where = function(index) {
  if(index === this.objectStore.keyPath) return console.error('This is primaryKey not index. Intances, use method get') 
  index = this.objectStore.index(index)
  return new IDBIndex(index)
}

export default IDBOjbectStore
import IDBIndex from './IDBIndex.js'

class IDBOjbectStore {
  objectStore
  constructor(objectStore) {
    this.objectStore = objectStore
  }
}

IDBOjbectStore.prototype.where = function(index) {
  index = this.objectStore.index(index)
  return new IDBIndex(index)
}

export default IDBOjbectStore
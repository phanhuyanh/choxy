class IDBIndex {
  #IDBIndex
  constructor(IDBIndex) {
    this.#IDBIndex = IDBIndex
  }
  above(x) {
    let lowerBound = IDBKeyRange.lowerBound(x, true)
    return this.#openCursor(lowerBound)
  }
  aboveOrEqual(x) {
    let lowerBound = IDBKeyRange.lowerBound(x)
    return this.#openCursor(lowerBound)
  }
  below(y) {
    let upperBound = IDBKeyRange.upperBound(y, true)
    return this.#openCursor(upperBound)
  }
  belowOrEqual(y) {
    let upperBound = IDBKeyRange.upperBound(y)
    return this.#openCursor(upperBound)
  }
  equals(x) {
    let only = IDBKeyRange.only(x)
    return this.#openCursor(only)
  }
  between(x, y, equalX = false, equalY = false) {
    let bound = IDBKeyRange.bound(x, y, equalX, equalY)
    return this.#openCursor(bound)
  }
  async #openCursor(IDBKeyRange) {
    let cursors = []

    await new Promise(res => {
      this.#IDBIndex.openCursor(IDBKeyRange).onsuccess = evt => {
        let cursor = evt.target.result
        if(cursor) {
          cursors.push({key: cursor.key, value: cursor.value})
          cursor.continue()
        }
        else res()
      }
    })
    return cursors
  }
}

export default IDBIndex
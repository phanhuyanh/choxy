import { v4 as uuidv4 } from 'uuid'
import { isObject } from './common.js'
import IDB from './indexedDB.js'

class Choxy {
  #pool
  constructor() {
    this.store = {}
    this.#pool = {}
  }
  add(key, value) {
    if(this.store[key] !== undefined) return false
    this.store[key] = value
    this.#reactImmediate(key)
    return true
  }
  get(key) {
    return this.store[key]
  }
  update(key, value) {
    if(this.store[key] === value) return
    this.store[key] = value
    this.#reactive(key, value)
  }
  remove(key) {
    delete this.store[key]
    delete this.#pool[key]
  }
  watch(key, cb, options = {}) {
    if(typeof cb != 'function') return false
    let id = uuidv4()
    this.#pool[key] = this.#pool[key] || {}
    this.#pool[key][id] = {cb, options}
    return id
  }
  unwatch(key, id) {
    if(!this.#pool[key]) return false
    delete this.#pool[key][id]
    return true
  }
  #reactImmediate(key) {
    if(!this.#pool[key]) return
    for(let id in this.#pool[key]) {
      let {cb, options} = this.#pool[key][id]
      if(!isObject(options)) return
      let {immediate} = options
      if(!immediate) continue
      cb()
    }
  }
  #reactive(key, value) {
    if(!this.#pool[key]) return
    for(let id in this.#pool[key]) {
      let {cb} = this.#pool[key][id]
      Promise.resolve(cb(value))
    }
  }
}

Choxy.prototype.idb = IDB

var choxy = new Choxy()
window.choxy = choxy
module.exports = choxy
//export default choxy

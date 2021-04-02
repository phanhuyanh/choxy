export const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]'

export const isPositiveNumber = num => typeof num === 'number' && num > 0
Choxy
----------

![](https://badgen.net/npm/v/@stoxy/stoxy)
[![Build Status](https://travis-ci.com/w3c/IndexedDB.svg?branch=main)]()
![](https://badgen.net/bundlephobia/dependency-count/@stoxy/core)

The reactive state management system and wrapper for IndexedDB.

Choxy allows you to easily handle, save data to IndexedDB

## Installation
```
npm i choxy
```

## Usage

#### Add

```js
import choxy from 'choxy'

choxy.add(key, value)

```

#### Get

```js
import choxy from 'choxy'

choxy.get(key)

```

#### Update

```js
import choxy from 'choxy'

choxy.update(key, newValue)

```

#### Remove

```js
import choxy from 'choxy'

choxy.remove(key)

```

#### Watch

```js
import choxy from 'choxy'

// Callback will trigger when value of key change. Method return id_watch
// With option is immediate = true then callback will trigger when init value

id = choxy.watch(key, callback, { immediate: true | false})

```

#### Unwatch

```js
import choxy from 'choxy'

choxy.unwatch(key, id)

```

## Wrapper for IndexedDB

#### Create database

```js
db = new choxy.idb('MyDatabase')

await db.version(1).create({
  friends: '++id,name,age',        // first field is id
  customers: 'snn,name,age,&email' // With field is unique then add prefix '&' for field
})

```

```nameDatabase```: nameDatabase what you want crate

```version```: version of database. It necessary when you want create objectStore then version must greater current version

```tables```: Object store with key is name table and type of value is string format ```primaryKey,field1,field2,...```

If primaryKey equal ``` ++id ``` then autoincrement start from 1


#### Add entry to Table

```js
status = await db.query('customers').add({snn: '111-11-1111', name: 'john', email: 'john@gmail.com', age: 24})

If status equal true then add success and otherwise

```

#### Remove entry to Table

```js
status = await db.query('customers').delete('111-11-1111')

```

#### Update entry to Table

```js
status = await db.query('customers').update('111-11-1111', {snn: '111-11-1111', name: 'john', email: 'john@gmail.com', age: 27})

```

#### Clear all entry from Table
```js
status = await db.query('customers').clear()

```

#### Get entry from Table

```js
entry = await db.query('customers').get('111-11-1111')

```

#### Get all entries from Table
```js
entries = await db.query('customers').getAll().offset(1).limit(4).sortBy((a,b) => b.age - a.age).toArray()

```

``` offset ```: Get entries from index offset

``` limit ```: Return limit entries

``` sortBy ```: Take callback which similar Array.sort()

``` toArray ```: Necessary return entries as array

#### Get Count entries from Table

```js
count = await db.query('customers').count()

```

#### Iterate each entry from Table
```js
db.query('customers').forEach(entry => {
  console.log('Key: ', entry.key, 'Value: ', entry.value)
})

```

#### Find range above
```js
await db.query(table).where(field).above(x)

```

#### Find range aboveOrEqual
```js
await db.query(table).where(field).aboveOrEqual(x)

```

#### Find range below
```js
await db.query(table).where(field).below(y)

```

#### Find range belowOrEqual
```js
await db.query(table).where(field).belowOrEqual(y)

```

#### Find between 
```js
await db.query(table).where(field).between(x, y, equalX, equalY)

// equalX: false, equalY: false   --> >= x and <= y
// equalX: false, equalY: true    --> >=x and < y
// equalX: true, equalY: false    --> < x and <= y
// equalX: true, equalY: true     --> < x and < y
```

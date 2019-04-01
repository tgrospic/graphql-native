import R from 'ramda'
import sqlite from 'sqlite'
import config from '../config'
import { ItemEntity } from '../schema'
import { logger, mkDir } from '../lib'


// Ensure db folder
mkDir(config.db.storage)

const dbPromise = sqlite.open(config.db.storage, { Promise, cached: true })

export const dbExec = async (dbOp, ...args) => {
  const db = await dbPromise
  // Execute sql
  const result = await dbOp(db, ...args)
  // logger.debug('DATA', result)
  return result
}

export const dbTransact = async (dbOp, ...args) => {
  const db = await dbPromise
  await db.run(`BEGIN TRANSACTION`)
  await db.run(`PRAGMA foreign_keys = ON`)
  try {
    // Execute sql
    const result = await dbOp(db, ...args)
    // logger.debug('DATA', result)
    await db.run(`COMMIT`)
    return result
  } catch (ex) {
    await db.run(`ROLLBACK`)
    throw ex
  }
}

export const insertItems = async (db, mkItems) => {
  const [{i}]     = await db.all(`SELECT max(id) i FROM items`)
  const fieldKeys = R.keys(ItemEntity.fields)
  const toValues  = (acc, x) => acc.concat(R.map(R.prop(R.__, x), fieldKeys))
  // Create items from last id
  const itemsTree = mkItems(i)
  // Flatten and fix parent->child relations
  const fixRel = ([acc, uid], it) => {
    it.id = ++uid
    const xs = it.items || []
    // Set parent ID
    R.forEach(x => x.itemId = it.id, xs)
    // Flatten childs
    const [ys, nuid] = flatten(uid)(xs)
    return [[...acc, it, ...ys], nuid]
  }
  const flatten = uid => R.reduce(fixRel, [[], uid])
  const [items] = flatten(i)(itemsTree)
  // Sql params
  const keysStr   = fieldKeys.join(', ')
  const paramItem = R.repeat('?', fieldKeys.length).join(', ')
  const paramsStr = R.repeat(`(${paramItem})`, items.length).join(', ')
  // Insert query
  const sql       = `INSERT INTO items (${keysStr}) VALUES ${paramsStr}`
  const valsList  = R.reduce(toValues, [], items)
  const saveInfo  = await db.run(sql, valsList)
  // logger.debug('CREATE', saveInfo.stmt)
  return {
    result: itemsTree,
    info: {
      lastID: saveInfo.stmt.lastID,
      changes: saveInfo.stmt.changes,
    },
  }
}

export const updateItem = async (db, item, where) => {
  // Sql params
  const keyVal    = Object.entries(item).filter(([k, v]) => v !== undefined)
  const values    = R.map(R.nth(1), keyVal)
  const keysStr   = R.map(([k, _]) => `${k}=?`, keyVal).join(', ')
  // Update query
  const whereStr  = where || '1=1'
  const sql       = `UPDATE items SET ${keysStr} WHERE ${whereStr}`
  const saveInfo  = await db.run(sql, values)
  // logger.debug('UPDATE', saveInfo.stmt, values)
  return {
    result: item,
    info: {
      lastID: saveInfo.stmt.lastID,
      changes: saveInfo.stmt.changes,
    },
  }
}

export const deleteItem = async (db, where) => {
  // Delete query
  const whereStr = where || '1=1'
  const sql       = `DELETE FROM items WHERE ${whereStr}`
  const saveInfo  = await db.run(sql)
  // logger.debug('DELETE', saveInfo.stmt)
  return {
    result: saveInfo.stmt.changes,
    info: {
      lastID: saveInfo.stmt.lastID,
      changes: saveInfo.stmt.changes,
    },
  }
}

export const loadItems = db => db.all(`SELECT * FROM items`)

export const initializeDB = async () => {
  const createItemTable = db => db.run(
    `CREATE TABLE IF NOT EXISTS items (
      -- id INTEGER PRIMARY KEY AUTOINCREMENT,
      id INT PRIMARY KEY NOT NULL, -- autoincrement disabled
      itemId INTEGER REFERENCES items (id) ON DELETE CASCADE ON UPDATE CASCADE,
      itype VARCHAR(255),
      valString VARCHAR(255),
      valInt INTEGER,
      valDate DATETIME,
      info VARCHAR(255))`)
  await dbTransact(createItemTable)
}

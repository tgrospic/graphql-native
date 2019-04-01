import R from 'ramda'
import { GraphQLInt, GraphQLList } from 'graphql'
import { gqlType, itemType, itemInputType } from './types'
import { GraphQLAny } from './helpers'
import { dbTransact, insertItems, updateItem, deleteItem } from './database'
import { logger } from '../lib'

const resultType = (name, innerType) =>
  gqlType({
    name: `${name}Result`,
    fields: {
      info: { type: GraphQLAny },
      result: { type: innerType },
    }
  })

const itemCreate = ({
  args: { value: { type: itemInputType } },
  type: resultType('itemCreate', new GraphQLList(itemType)),
  resolve: async function (rootValue, {value}, ctx, field) {
    const items = i => [value]
    return await dbTransact(insertItems, items)
  },
  description: `create items`,
})

const itemUpdate = ({
  args: {
    value: { type: itemInputType },
    where: { type: GraphQLAny },
  },
  type: resultType('itemUpdate', itemType),
  resolve: async function (rootValue, {value, where}, ctx, field) {
    return await dbTransact(updateItem, value, where)
  },
  description: `update items`,
})

const itemDelete = ({
  args: {
    where: { type: GraphQLAny },
  },
  type: resultType('itemDelete', GraphQLInt),
  resolve: async function (rootValue, {where}, ctx, field) {
    return await dbTransact(deleteItem, where)
  },
  description: `delete items`,
})

export default function (types) {
  // Update definition
  const create = (acc, [type, inType]) => ({
    ...acc,
    [`${type.name}Create`]: {
      args: {
        value: { type: inType }
      },
      type,
      resolve: (rootValue, {value}, ctx, field) => {
        logger.debug('CREATE', type.name, value)
        return value
      },
    }
  })
  const createTypes = R.reduce(create, {}, types)

  // Create definition
  const update = (acc, [type, inType]) => ({
    ...acc,
    [`${type.name}Update`]: {
      args: {
        value: { type: inType },
        where: { type: GraphQLAny },
      },
      type,
      resolve: (rootValue, {value, where}, ctx, field) => {
        logger.debug('UPDATE', type.name, value, where)
        return value
      },
    }
  })
  const updateTypes = R.reduce(update, {}, types)

  // Delete definition
  const deletee = (acc, [type, inType]) => ({
    ...acc,
    [`${type.name}Delete`]: {
      args: {
        where: { type: GraphQLAny },
      },
      type: GraphQLInt,
      resolve: (rootValue, {where}, ctx, field) => {
        logger.debug('DELETE', type.name, where)
        return 42
      },
    }
  })
  const deleteTypes = R.reduce(deletee, {}, types)

  return gqlType({
    name: 'rootMutation',
    fields: {
      // Item mutations
      itemCreate,
      itemUpdate,
      itemDelete,

      // Dynamic mutations
      ...createTypes,
      ...updateTypes,
      ...deleteTypes,
    },
  })
}

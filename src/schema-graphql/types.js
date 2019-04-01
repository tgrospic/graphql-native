import R from 'ramda'
import { GraphQLObjectType, GraphQLInputObjectType, GraphQLString, GraphQLInt, GraphQLFloat, GraphQLList } from 'graphql'
import { GraphQLDateTime } from 'graphql-iso-date'
import { FIELD, ENTITY, EntitySchema } from '../schema'
import { dbExec, loadItems } from './database'
import { logger } from '../lib'

// Base types mapping
const fieldToGraphQLTypeMap = {
  [FIELD.PK_NUM_SEQ]: {
    // type: new GraphQLNonNull(GraphQLInt),
    // Non-null because it's optional on input types
    type: GraphQLInt,
  },
  [FIELD.NUMBER]: {
    type: GraphQLInt,
  },
  [FIELD.DECIMAL]: {
    type: GraphQLFloat,
  },
  [FIELD.STRING]: {
    type: GraphQLString,
  },
  [FIELD.DATE]: {
    type: GraphQLDateTime,
  },
}

// Field -> GraphQLProp
export const toGqlProp = ({name, type, description}) => ({
  [name]: {
    ...fieldToGraphQLTypeMap[type],
    description
  },
})

// Field[] -> GraphQLProp
export const toGqlProps = R.reduce((acc, x) => ({...acc, ...toGqlProp(x)}), {})

// GraphQL type (definition) builder
const typeDef = (entity, description, override = R.identity) => ({
  name: entity,
  description,
  fields: () => R.pipe(toGqlProps, override) (EntitySchema[entity]),
})

// Create GraphQL Type (return objects)
export const gqlType = x => new GraphQLObjectType(x)

// Create GraphQL Type (input objects)
export const gqlTypeInput = x => new GraphQLInputObjectType({ ...x, name: `${x.name}Input` })


/***************************************************************
*
* GraphQL types definition
*
****************************************************************/

// Item
const itemDef = typeDef(ENTITY.ITEM, 'this is Item type', fields => ({
  ...fields,
  items: {
    type: new GraphQLList(itemType),
    description: 'child items',
  },
}))
export const itemType = gqlType(itemDef)

export const itemInputDef = typeDef(ENTITY.ITEM, 'this is Item type', fields => ({
  ...fields,
  items: {
    type: new GraphQLList(itemInputType),
    description: 'child items',
  },
}))
export const itemInputType = gqlTypeInput(itemInputDef)

export async function loadDynamicTypes() {
  // Flat items collection
  const items = await dbExec(loadItems)

  // Convert items to tree structure (hierarchy)
  const treeify = (acc, it) => {
    const parent = R.find(x => x.id === it.itemId, items)
    if (parent) {
      parent.items = parent.items || []
      parent.items.push(it)
    } else {
      acc.push(it)
    }
    return acc
  }
  const itemsTree = R.reduce(treeify, [], items)
  // logger.debug('ITEMS', JSON.stringify(itemsTree, null, 2))

  // Find root
  const root = R.find(x => x.itype === 'ROOT', itemsTree) || []

  const def = it => {
    const toObj = (acc, x) => {
      const prop = toGqlProp({
        name: x.valString,
        type: x.itype,
        description: x.info,
      })
      return {...acc, ...prop}
    }
    return {
      name: it.valString,
      description: it.info,
      fields: R.reduce(toObj, {}, it.items || [])
    }
  }
  const typeDefinitions = R.map(def, root.items || [])
  // logger.debug('TYPES', JSON.stringify(typeDefinitions, null, 2))

  return R.map(x => [gqlType(x), gqlTypeInput(x)], typeDefinitions)
}

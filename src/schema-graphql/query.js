import R from 'ramda'
import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql'
import { gqlType, itemType } from './types'
import { resolveQuery } from './resolver'
import { GraphQLAny } from './helpers'
import config from '../config'
import { logger } from '../lib'

// Query parameters

const queryArgs = {
  where:   { type: GraphQLAny },
  limit:   { type: GraphQLInt },
  skip:    { type: GraphQLInt },
  orderBy: { type: new GraphQLList(new GraphQLList(GraphQLString)) },
}

export default function (types) {

  const typeCollection = (acc, [type, _]) => ({
    ...acc,
    [`${type.name}s`]: {
      type: new GraphQLList(type),
      description: type.description,
      args: queryArgs,
      resolve: resolveQuery,
    }
  })
  const rootTypes = R.reduce(typeCollection, {}, types)

  return gqlType({
    name: 'rootQuery',
    description: 'GraphQL root type',
    fields: {

      items: {
        type: new GraphQLList(itemType),
        description: 'item collection',
        args: queryArgs,
        resolve: resolveQuery,
      },

      ...rootTypes,

      // App config
      config: {
        type: GraphQLAny,
        resolve: () => config,
      },
    }
})}

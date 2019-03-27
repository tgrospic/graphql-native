import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql'
import { gqlType, userType, orderType, orderItemType, orderStatusType, itemType } from './types'
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

export default gqlType({
  name: 'rootQuery',
  description: 'GraphQL root type',
  fields: {
    items: {
      type: new GraphQLList(itemType),
      description: 'item collection',
      args: queryArgs,
      resolve: resolveQuery,
    },

    users: {
      type: new GraphQLList(userType),
      description: 'user collection',
      args: queryArgs,
      resolve: resolveQuery,
    },
    orders: {
      type: new GraphQLList(orderType),
      description: 'order collection',
      args: queryArgs,
      resolve: resolveQuery,
    },
    orderItems: {
      type: new GraphQLList(orderItemType),
      description: 'order item collection',
      args: queryArgs,
      resolve: resolveQuery,
    },
    orderStatuses: {
      type: new GraphQLList(orderStatusType),
      description: 'order status collection',
      args: queryArgs,
      resolve: resolveQuery,
    },
    // App config
    config: {
      type: GraphQLAny,
      resolve: () => config,
    },
  }
})

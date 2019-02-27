import { GraphQLObjectType, GraphQLInt, GraphQLList, GraphQLScalarType, GraphQLString, GraphQLBoolean } from 'graphql'
import { userType, orderType, orderItemType, orderStatusType } from './types'
import { createMutation, updateMutation, deleteMutation } from './resolver'
import { GraphQLAny } from './helpers'
import { ENTITY } from '../schema'
import { logger } from '../lib'

const typeAny = {
  type: GraphQLAny,
}

const createEntityMutation = (gqlType, entity, options) => ({
  type: gqlType,
  args: {
    value: typeAny
  },
  resolve: createMutation(entity, options),
})

const updateEntityMutation = (gqlType, entity, options) => ({
  type: gqlType,
  args: {
    value: typeAny,
    where: typeAny,
  },
  resolve: updateMutation(entity, options),
})

const deleteEntityMutation = (gqlType, entity, options) => ({
  type: gqlType,
  args: {
    where: typeAny,
  },
  resolve: deleteMutation(entity, options),
})

export default new GraphQLObjectType({
  name: 'RootMutationType',
  fields: {
    // create
    createUser: createEntityMutation(userType, ENTITY.USER, { include: 'orders' }),
    createOrder: createEntityMutation(orderType, ENTITY.ORDER, { include: ['user', 'orderItems', 'statuses'] }),
    createOrderItem: createEntityMutation(orderItemType, ENTITY.ORDER_ITEM, { include: 'order' }),
    createOrderStatus: createEntityMutation(orderStatusType, ENTITY.ORDER_STATUS, { include: 'order' }),
    // update
    updateUser: updateEntityMutation(GraphQLInt, ENTITY.USER),
    updateOrder: updateEntityMutation(GraphQLInt, ENTITY.ORDER),
    updateOrderItem: updateEntityMutation(GraphQLInt, ENTITY.ORDER_ITEM),
    updateOrderStatus: updateEntityMutation(GraphQLInt, ENTITY.ORDER_STATUS),
    // delete
    deleteUser: deleteEntityMutation(GraphQLInt, ENTITY.USER),
    deleteOrder: deleteEntityMutation(GraphQLInt, ENTITY.ORDER),
    deleteOrderItem: deleteEntityMutation(GraphQLInt, ENTITY.ORDER_ITEM),
    deleteOrderStatus: deleteEntityMutation(GraphQLInt, ENTITY.ORDER_STATUS),
  },
})

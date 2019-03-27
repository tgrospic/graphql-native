import { GraphQLInt, GraphQLString, GraphQLNonNull } from 'graphql'
import { gqlType, gqlTypeInput, userType, userInputType, orderType, orderItemType, orderStatusType, itemType, itemInputType } from './types'
import { createMutation, updateMutation, deleteMutation } from './resolver'
import { GraphQLAny } from './helpers'
import { ENTITY } from '../schema'
import { logger } from '../lib'

const typeAny = {
  type: GraphQLAny,
}

const createEntityMutation = (type, inputType, entity, options) => ({
  type,
  args: { value: { type: inputType } },
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

export default gqlType({
  name: 'rootMutation',
  fields: {
    // Sample mutation method
    mutationSample: {
      // Function parameters
      args: {
        // sampleInputType
        inputNumber: { type: new GraphQLNonNull(GraphQLInt) },
        inputString: { type: GraphQLString },
      },
      // Function return type
      type: gqlType({
        name:  `sampleReturnType`,
        fields: () => ({
          returnNumber: { type: GraphQLInt },
          returnString: { type: GraphQLString },
        }),
      }),
      // mutationSample : sampleInputType -> sampleReturnType
      resolve: (root, {inputNumber, inputString}) => {
        logger.debug(`mutationSample.resolve: `, {inputNumber, inputString})
        return {
          returnNumber: inputNumber + 100,
          returnString: `Echo -> ${inputString}!`
        }
      },
    },

    // Create item
    createItem: createEntityMutation(itemType, itemInputType, ENTITY.ITEM, { include: 'items' }),

    // create
    createUser: createEntityMutation(userType, userInputType, ENTITY.USER, { include: 'orders' }),
    createOrder: createEntityMutation(orderType, GraphQLAny, ENTITY.ORDER, { include: ['user', 'orderItems', 'statuses'] }),
    createOrderItem: createEntityMutation(orderItemType, GraphQLAny, ENTITY.ORDER_ITEM, { include: 'order' }),
    createOrderStatus: createEntityMutation(orderStatusType, GraphQLAny, ENTITY.ORDER_STATUS, { include: 'order' }),
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

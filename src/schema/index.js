import R from 'ramda'
import * as User from './user'
import * as Order from './order'

export * from './field'

// Entity names
export const ENTITY = {
  USER:         'user',
  ORDER:        'order',
  ORDER_ITEM:   'orderItem',
  ORDER_STATUS: 'orderStatus',
}

// Convert field definitions object to list
// [
//   {
//     "entity": "user",
//     "name": "id",
//     "type": "PK_NUM_SEQ",
//     "description": "user identifier"
//   },
//   {
//     "entity": "user",
//     "name": "firstName",
//     "type": "STRING",
//     "description": "user first name"
//   },
//   ...
// ]
const createEntity = (entity, fieldsDefObj) => {
  // Convert to object with `entity` name and `name` of field
  const toFieldObjWith = ([fieldName, props]) => ({ entity, name: fieldName, ...props })
  return R.pipe(R.toPairs, R.map(toFieldObjWith)) (fieldsDefObj)
}

const allFields = [
  createEntity(ENTITY.USER,         User.fields),
  createEntity(ENTITY.ORDER,        Order.fields),
  createEntity(ENTITY.ORDER_ITEM,   Order.itemFields),
  createEntity(ENTITY.ORDER_STATUS, Order.statusFields),
]

// Schema definition (all fields)
export const Schema = R.reduce(R.concat, [], allFields)

// Field[] -> { [Entity]: Field[] }
const groupByEntity = R.groupBy(({entity}) => entity)

// Fields grouped by entity
export const EntitySchema = groupByEntity(Schema)


/***************************************************************
*
* Schema definition (with relations)
*
****************************************************************/

export const UserEntity = {
  type: ENTITY.USER,
  fields: User.fields,
  description: 'this is User type',
  rels: {
    orders: () => ({
      type: 'many',
      entity: OrderEntity,
      null: false,
      delete: 'CASCADE',
      description: 'user\'s orders',
    }),
  },
}

export const OrderEntity = {
  type: ENTITY.ORDER,
  fields: Order.fields,
  description: 'this is Order type',
  rels: {
    user: () => ({
      type: 'single',
      entity: UserEntity,
      description: 'user who has this Order',
    }),
    orderItems: () => ({
      type: 'many',
      entity: OrderItemEntity,
      null: false,
      delete: 'CASCADE',
      description: 'items on this Order',
    }),
    statuses: () => ({
      type: 'many',
      entity: OrderItemEntity,
      null: false,
      delete: 'CASCADE',
      description: 'statuses of this Order',
    }),
  },
}

export const OrderItemEntity = {
  type: ENTITY.ORDER_ITEM,
  fields: Order.itemFields,
  description: 'this is OrderItem type',
  rels: {
    order: () => ({
      type: 'single',
      entity: OrderEntity,
      description: 'parent Order',
    }),
  },
}

export const OrderStatusEntity = {
  type: ENTITY.ORDER_STATUS,
  fields: Order.statusFields,
  description: 'this is OrderStatus type',
  rels: {
    order: () => ({
      type: 'single',
      entity: OrderEntity,
      description: 'related Order',
    }),
  },
}

export const RootEntity = {
  type: 'root',
  description: 'GraphQL root type',
  fields: {
    users: {
      type: 'many',
      entity: UserEntity,
      description: 'user collection',
    },
    orders: {
      type: 'many',
      entity: UserEntity,
      description: 'order collection',
    },
    orderItems: {
      type: 'many',
      entity: OrderEntity,
      description: 'order item collection',
    },
    orderStatuses: {
      type: 'many',
      entity: OrderStatusEntity,
      description: 'order status collection',
    },
  },
}

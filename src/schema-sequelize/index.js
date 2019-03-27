import R from 'ramda'
import Sequelize from 'sequelize'
import config from '../config'
import { FIELD, ENTITY, EntitySchema } from '../schema'
import { logger } from '../lib'

// Base types mapping
const fieldToSequelizeTypeMap = {
  [FIELD.PK_NUM_SEQ]: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  [FIELD.NUMBER]: {
    type: Sequelize.INTEGER,
  },
  [FIELD.DECIMAL]: {
    type: Sequelize.DECIMAL,
  },
  [FIELD.STRING]: {
    type: Sequelize.STRING,
  },
  [FIELD.DATE]: {
    type: Sequelize.DATE,
  },
}

// Field -> SequelizeProp
const toSequelizeProp = ({name, type}) => ({
  [name]: R.clone(fieldToSequelizeTypeMap[type]),
})

// Field[] -> SequelizeProp
const sequelizeProps = R.reduce((acc, x) => ({...acc, ...toSequelizeProp(x)}), {})

const fkNotNull = {
  foreignKey: { allowNull: false },
  onDelete: 'CASCADE',
}

const fkNull = {
  foreignKey: { allowNull: true },
  onDelete: 'CASCADE',
}

// Create Sequelize schema instance (singleton)
const sequelize = new Sequelize(null, null, null, config.db)

// Clone because Sequelize modifies input object
const entityMap = R.clone(EntitySchema)

/***************************************************************
*
* Sequelize schema definition
*
****************************************************************/

// Sequelize type builder
const defineEntity = entity => sequelize.define(entity, sequelizeProps(entityMap[entity]))

// Entities
const Item        = defineEntity(ENTITY.ITEM)
const User        = defineEntity(ENTITY.USER)
const Order       = defineEntity(ENTITY.ORDER)
const OrderItem   = defineEntity(ENTITY.ORDER_ITEM)
const OrderStatus = defineEntity(ENTITY.ORDER_STATUS)

// Item relations
Item.hasMany(Item, { as: 'items', ...fkNull })
Item.belongsTo(Item, { as: 'item' })

// User relations
User.hasMany(Order, { as: 'orders', ...fkNotNull })

// Order relations
Order.belongsTo(User, { as: 'user' })
Order.hasMany(OrderItem, { as: 'orderItems', ...fkNotNull })
Order.hasMany(OrderStatus, { as: 'statuses', ...fkNotNull })

// OrderItem relations
OrderItem.belongsTo(Order, { as: 'order' })

// OrderStatus relations
OrderStatus.belongsTo(Order, { as: 'order' })

export default sequelize

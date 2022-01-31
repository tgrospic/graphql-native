import R from 'ramda'
import * as Item from './item'

export * from './field'

// Entity names
export const ENTITY = {
  ITEM: 'item',
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
  createEntity(ENTITY.ITEM, Item.fields),
]

// Schema definition (all fields)
export const Schema = R.reduce(R.concat, [], allFields)

// Field[] -> { [Entity]: Field[] }
const groupByEntity = R.groupBy(({entity}) => entity)

// Fields grouped by entity
export const EntitySchema = groupByEntity(Schema)


/***************************************************************
*
* Schema definition (starting point)
*
****************************************************************/

export const ItemEntity = {
  type: ENTITY.ITEM,
  fields: Item.fields,
  description: 'this is Item type',
  rels: {
    items: () => ({
      type: 'many',
      entity: ItemEntity,
      null: false,
      delete: 'CASCADE',
      description: 'item\'s children',
    }),
  },
}

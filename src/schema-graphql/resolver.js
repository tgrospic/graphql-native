import R from 'ramda'
import Sequelize from 'sequelize'
import sequelizeValues from 'sequelize-values'
import sequelizeSchema from '../schema-sequelize'
import { logger } from '../lib'

// FIX: add Sequelize.getValues() to strip only values from Sequelize record
sequelizeValues(Sequelize)

// GraphQL field to sequelize `include` property
const selectionToInclude = schema => field => {
  const getName   = R.path(['name', 'value'])
  const getChilds = R.path(['selectionSet', 'selections'])
  // name & child selection
  const name = getName(field)
  const selections = getChilds(field) || []
  // read type from GQL schema
  const thisField = schema.getFields()[name]
  const thisType  = thisField.type.ofType || thisField.type
  const modelName = `${thisType}`
  // atrributes - selection-less fields
  // include    - nested selection
  const attributes = R.pipe( R.filter(x => !getChilds(x)), R.map(getName) ) (selections)
  const includes = R.pipe( R.filter(x => !!getChilds(x)), R.map(selectionToInclude(thisType)) ) (selections)
  return ({
    name,
    model: sequelizeSchema.model(modelName),
    as: name,
    attributes,
    include: includes,
  })
}

const deleteEmpty = obj => {
  R.is(Object, obj) && Object.entries(obj).forEach(([key, val]) => {
    // Trim strings
    R.is(String, val) && (val = val.trim()) && (obj[key] = val);
    // Delete empty fields
    (R.isNil(val) || R.isEmpty(val)) && delete obj[key] ||
      R.is(Object, val) && deleteEmpty(val)
  })
  return obj
}

const emptyToNull = obj => {
  R.is(Object, obj) && Object.entries(obj).forEach(([key, val]) => {
    // Trim strings
    R.is(String, val) && (val = val.trim()) && (obj[key] = val);
    // Delete empty fields
    R.isEmpty(val) && (obj[key] = null) ||
      R.is(Object, val) && emptyToNull(val)
  })
  return obj
}

/****************************************************************
*
* GraphQL resolvers - SQL query builder
*
*****************************************************************/

// Read resolver

export async function resolveQuery(rootValue, {where, limit, skip, orderBy}, context, field) {
  const schemaRoot = field.schema._typeMap.RootQueryType
  const rootField  = field.fieldNodes[0]
  const queryModel = selectionToInclude(schemaRoot)(rootField)

  // Sequelize (SQL) SELECT query
  return await queryModel.model.findAll({
    include: queryModel.include,
    attributes: queryModel.attributes,
    where,
    limit,
    offset: skip,
    order: orderBy,
  })
  .then(Sequelize.getValues)
  .then(deleteEmpty)
}

// Write resolvers

export function createMutation (entity, options) {
  const model = sequelizeSchema.model(entity)
  return async function (rootValue, {value}, ctx, field) {
    // Sequelize (SQL) INSERT query
    return await model.create(deleteEmpty(value), options)
  }
}

export function updateMutation (entity, options) {
  const model = sequelizeSchema.model(entity)
  return async function (rootValue, {value, where}, ctx, field) {
    // Sequelize (SQL) UPDATE query
    const [v] = await model.update(emptyToNull(value), { ...options, where })
    return v
  }
}

export function deleteMutation (entity, options) {
  const model = sequelizeSchema.model(entity)
  return async function (rootValue, {where}, ctx, field) {
    // Sequelize (SQL) DELETE query
    return await model.destroy({ ...options, where })
  }
}

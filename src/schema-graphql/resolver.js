import R from 'ramda'
import { dbExec, loadItems } from './database'
import { logger } from '../lib'

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
  // atrributes - selection-less fields
  // include    - nested selection
  const attributes = R.pipe( R.filter(x => !getChilds(x)), R.map(getName) ) (selections)
  const includes = R.pipe( R.filter(x => !!getChilds(x)), R.map(selectionToInclude(thisType)) ) (selections)
  return ({
    name,
    type: thisType,
    as: name,
    attributes,
    include: includes,
  })
}

/****************************************************************
*
* GraphQL resolvers - SQL query builder
*
*****************************************************************/

// Read resolver

export async function resolveQuery(rootValue, {where, limit, skip, orderBy}, context, field) {
  const schemaRoot = field.schema._typeMap.rootQuery
  const rootField  = field.fieldNodes[0]
  const queryModel = selectionToInclude(schemaRoot)(rootField)

  // logger.debug('QUERY', JSON.stringify(queryModel, null, 2))

  const items = await dbExec(loadItems)

  return items
}

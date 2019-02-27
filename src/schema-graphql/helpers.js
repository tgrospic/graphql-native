import R from 'ramda'
import { GraphQLScalarType } from 'graphql'

export const gqlFieldToObject = gField => {
  const fieldsToObj = R.pipe(R.map(gqlFieldToObject), R.reduce(R.merge, {}))
  // types
  const isFields  = gField.kind === 'ObjectValue'
  const isField   = gField.kind === 'ObjectField'
  const isList    = gField.kind === 'ListValue'
  // getters
  const getName       = R.path(['name', 'value'])
  const getValue      = R.path(['value'])
  const getListValues = R.path(['values'])
  const getFields     = R.path(['fields'])
  // build result
  const name    = getName(gField)
  return isFields
    ? fieldsToObj (getFields(gField))
    : isField
      ? ({
        [name]: gqlFieldToObject(getValue(gField))
      })
      : isList
        ? R.map(gqlFieldToObject) (getListValues (gField))
        : getValue(gField)
}

export const GraphQLAny = new GraphQLScalarType({
  name: 'JsonObjectType',
  description: 'JSON object',
  serialize: R.identity,
  parseValue: R.identity,
  parseLiteral: gqlFieldToObject,
})

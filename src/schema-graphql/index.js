import { GraphQLSchema } from 'graphql'

import query from './query'
import mutation from './mutation'
import { loadDynamicTypes } from './types'
import { logger } from '../lib'

export default async function () {
  const types = await loadDynamicTypes()

  return new GraphQLSchema({
    query:    query(types),
    mutation: mutation(types),
  })
}


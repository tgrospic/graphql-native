import express from 'express'
import graphqlHTTP from 'express-graphql'
import graphQLSchema from './schema-graphql'
import config from './config'
import { initializeDB } from './schema-graphql/database'
import { logger } from './lib'

// Create Express server
const app = express()

// GraphQL API
app.use('/graphql', async (...args) => graphqlHTTP({
  // TODO: handle schema error
  schema: await graphQLSchema(),
  graphiql: true,
  pretty: true,
})(...args))

// Start server
initializeDB().then(() => {
  const server = app.listen(config.serverPort, '0.0.0.0', () => {
    const { address, port } = server.address()
    logger.info(`Server listening at http://localhost:${port}/graphql`)
  })
})

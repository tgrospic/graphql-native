import express from 'express'
import graphqlHTTP from 'express-graphql'
import sequelizeSchema from './schema-sequelize'
import graphQLSchema from './schema-graphql'
import config from './config'
import { mkDir, logger } from './lib'

// Create Express server
const app = express()

// GraphQL API
app.use('/graphql', graphqlHTTP({
  schema: graphQLSchema,
  graphiql: true,
  pretty: true,
}))

// Ensure db folder
mkDir(config.db.storage)

// Database init/sync
sequelizeSchema.sync().then(() => {
  // Start server
  const server = app.listen(config.serverPort, '0.0.0.0', () => {
    const { address, port } = server.address()
    logger.info(`Server listening at http://localhost:${port}/graphql`)
  })
})

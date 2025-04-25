import express from 'express'
import { Request, Response } from 'express'
import { ApolloServer } from 'apollo-server-express'
import typeDefs from './graphql/typeDefs.js'
import resolvers from './graphql/resolvers.js'
import connectDB from './db.js'
import dotenv from 'dotenv'
import { getUserFromToken } from './utils/auth.js'
import logger from './utils/logger.js'

interface ResponseError extends Error {
  status?: number;
}

dotenv.config()
const app = express() as any
app.use(express.json())

const startServer = async () => {
  await connectDB()

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const user = await getUserFromToken(req as any)
      return { user }
    },
    introspection: true,
    formatResponse: (res, req) => {
      const acceptHeader = req.request?.http?.headers.get('accept') || ''

      if(acceptHeader.includes('application/graphql-response+json')) {
        logger.info('Header testing')
      }
      return res
    }
  })
  
  await server.start()
  server.applyMiddleware({ app })

  app.get('/', (req: Request, res: Response) => {
    res.send('GraphQL API running...')
  });

  app.use((err: ResponseError, req: Request, res: Response, next: any) => {
    logger.error(`Unhandled error: ${err.message}`)
    
    const statusCode = err.status || 500
    const message = err.message || 'Internal Server Error'

    res.status(statusCode).json({
      error: true,
      message: message,
    })
  })

  const port = process.env.PORT || 5000
  app.listen(port, () => {
    logger.info(`🚀 Server running at http://localhost:${port}${server.graphqlPath}`)
  })
}

startServer()
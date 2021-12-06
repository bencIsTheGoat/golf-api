import fastify from 'fastify';
import './data-layer/database';
import jwt from 'fastify-jwt';
import logger from './util/logger';
import userRouter from './routers/user-router';
import contestRouter from './routers/contest-router';
import hooks from './util/hooks';

interface SuccessResponse {
  success: true
}

interface ErrorResponse {
  success: false
  errorMessage: string
}

export type APIResponse<Success> = Success & SuccessResponse | ErrorResponse

const server = fastify();
/**
 * Register hooks/middleware
 */
server.register(hooks)
server.register(jwt, { secret: process.env.JWT_SECRET || 'theMostSecretKeyOfAllFuckingTime' });

/**
 * Test Route
 */
server.get('/test', async (req, rep) => rep.send('yo ben'))

/**
 * User Router
 */
server.register(userRouter, { prefix: 'v1' })

/**
 * Contest Router
 */
server.register(contestRouter, { prefix: 'v1' })


const start = () => {
  server.listen(process.env.PORT || 8080, process.env.HOST || '127.0.0.1', (err, address) => {
    if (err) {
      logger.error(err)
      process.exit(1)
    }
    logger.info(`Server listening at ${address}`)
  })
}

export default start
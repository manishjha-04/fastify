'use strict'

const fastify = require('../fastify')({ logger: true })

const schema = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          hello: {
            type: 'string'
          }
        }
      }
    }
  }
}

function result () {
  return Promise.resolve({ hello: 'world' })
}

fastify
  .get('/await', schema, async function (req, reply) {
    reply.header('Content-Type', 'application/json').code(200)
    return result()
  })
  .get('/', schema, async function (req, reply) {
    reply.header('Content-Type', 'application/json').code(200)
    return { hello: 'world' }
  })

// A HEAD request to the /example endpoint will automatically respond with the same headers as the GET request.
fastify.listen(3000, err => {
  if (err) throw err
})

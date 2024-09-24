'use strict'

const fastify = require('../fastify')({ logger: true })

const opts = {
  schema: {
    response: {
      '2xx': {
        type: 'object',
        properties: {
          greet: { type: 'string' }
        }
      }
    }
  }
}

await fastify.register(function (instance, options, done) {
  // the route will be '/english/hello'
  instance.get('/hello', opts, (req, reply) => {
    reply.send({ greet: 'hello' })
  })
  done()
}, { prefix: '/english' })

await fastify.register(function (instance, options, done) {
  // the route will be '/italian/hello'
  instance.get('/hello', opts, (req, reply) => {
    reply.send({ greet: 'ciao' })
  })
  done()
}, { prefix: '/italian' })

// A HEAD request to the /example endpoint will automatically respond with the same headers as the GET request.
fastify.listen(8000, function (err) {
  if (err) {
    throw err
  }
})

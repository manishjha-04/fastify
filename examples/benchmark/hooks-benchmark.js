'use strict'

const fastify = require('../../fastify')({ logger: false })

const opts = {
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

fastify
  .addHook('onRequest', function (request, reply, done) {
    done()
  })
  .addHook('onRequest', function (request, reply, done) {
    done()
  })

fastify
  .addHook('preHandler', function (request, reply, done) {
    done()
  })
  .addHook('preHandler', function (request, reply, done) {
    setImmediate(done)
  })
  .addHook('preHandler', function (request, reply, done) {
    done()
  })

fastify
  .addHook('onSend', function (request, reply, payload, done) {
    done()
  })

fastify.register((instance, opts, done) => {
  instance.get('/', opts, function (request, reply) {
    reply.send({ hello: 'world' })
  });

  done();
});

// A HEAD request to the /example endpoint will automatically respond with the same headers as the GET request.
fastify.listen(3000, function (err) {
  if (err) {
    throw err
  }
})

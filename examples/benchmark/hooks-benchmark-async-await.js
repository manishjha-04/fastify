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

function promiseFunction (resolve) {
  setImmediate(resolve)
}

async function asyncHook () {
  await new Promise(promiseFunction)
}

fastify
  .addHook('onRequest', asyncHook)
  .addHook('onRequest', asyncHook)
  .addHook('preHandler', asyncHook)
  .addHook('preHandler', asyncHook)
  .addHook('preHandler', asyncHook)
  .addHook('onSend', asyncHook)

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

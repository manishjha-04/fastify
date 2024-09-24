'use strict'

const fastify = require('../../fastify')({
  logger: false
})

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

fastify.register((instance, opts, done) => {
  instance.get('/', schema, function (req, reply) {
      reply
        .send({ hello: 'world' })
    });

  done();
});

// A HEAD request to the /example endpoint will automatically respond with the same headers as the GET request.
fastify.listen(3000, (err, address) => {
  if (err) throw err
})

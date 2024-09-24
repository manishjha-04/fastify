'use strict'

const fastify = require('../fastify')({ logger: true })

fastify.addSchema({
  $id: 'https://foo/common.json',
  definitions: {
    response: {
      $id: '#reply',
      type: 'object',
      properties: {
        hello: {
          $id: '#bar',
          type: 'string'
        }
      }
    }
  }
})

const opts = {
  schema: {
    response: {
      200: { $ref: 'https://foo/common.json#reply' }
    }
  }
}

fastify.register((instance, opts, done) => {
  instance.get('/', opts, function (req, reply) {
      reply.send({ hello: 'world' })
    });

  done();
});

// A HEAD request to the /example endpoint will automatically respond with the same headers as the GET request.
fastify.listen(3000, err => {
  if (err) throw err
})

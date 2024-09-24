'use strict'

const fs = require('fs')
const path = require('path')
const fastify = require('../fastify')({
  http2: true,
  https: {
    key: fs.readFileSync(path.join(__dirname, '../test/https/fastify.key')),
    cert: fs.readFileSync(path.join(__dirname, '../test/https/fastify.cert'))
  },
  logger: true
})

const opts = {
  schema: {
    response: {
      '2xx': {
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
  instance.get('/', opts, function (req, reply) {
      reply.header('Content-Type', 'application/json').code(200)
      reply.send({ hello: 'world' })
    });

  done();
});

// A HEAD request to the /example endpoint will automatically respond with the same headers as the GET request.
fastify.listen(3000, err => {
  if (err) throw err
})

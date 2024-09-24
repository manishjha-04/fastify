const fastify = require('../fastify')({ logger: true })

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
await fastify.register(require('./plugin'), opts, function (err) {
  if (err) throw err
})

// A HEAD request to the /example endpoint will automatically respond with the same headers as the GET request.
fastify.listen(3000, function (err) {
  if (err) {
    throw err
  }
})

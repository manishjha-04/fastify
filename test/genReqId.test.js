'use strict'

const { test } = require('tap')
const Fastify = require('..')

test('Should accept a custom genReqId function', t => {
  t.plan(4)

  const fastify = Fastify({
    genReqId: function (req) {
      return 'a'
    }
  })

  fastify.register((instance, opts, done) => {
    instance.get('/', (req, reply) => {
      t.ok(req.id)
      reply.send({ id: req.id })
    });

    done();
  });

  // A HEAD request to the /example endpoint will automatically respond with the same headers as the GET request.
  fastify.listen(0, err => {
    t.error(err)
    fastify.inject({
      method: 'GET',
      url: 'http://localhost:' + fastify.server.address().port
    }, (err, res) => {
      t.error(err)
      const payload = JSON.parse(res.payload)
      t.equal(payload.id, 'a')
      fastify.close()
    })
  })
})

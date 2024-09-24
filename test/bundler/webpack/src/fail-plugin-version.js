const fp = require('fastify-plugin')
const fastify = require('../../../../')()

fastify.register((instance, opts, done) => {
  instance.get('/', function (request, reply) {
    reply.send({ hello: 'world' })
  });

  done();
});

await fastify.register(fp((instance, opts, done) => {
  done()
}, { fastify: '9.x' }))

module.exports = fastify

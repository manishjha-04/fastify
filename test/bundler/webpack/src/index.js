const fastify = require('../../../../')()
fastify.register((instance, opts, done) => {
  instance.get('/', function (request, reply) {
    reply.send({ hello: 'world' })
  });

  done();
});

module.exports = fastify

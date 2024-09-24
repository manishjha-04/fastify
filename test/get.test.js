'use strict'

const t = require('tap')
const test = t.test
const sget = require('simple-get').concat
const fastify = require('..')()

const schema = {
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

const nullSchema = {
  schema: {
    response: {
      '2xx': {
        type: 'null'
      }
    }
  }
}

const numberSchema = {
  schema: {
    response: {
      '2xx': {
        type: 'object',
        properties: {
          hello: {
            type: 'number'
          }
        }
      }
    }
  }
}

const querySchema = {
  schema: {
    querystring: {
      type: 'object',
      properties: {
        hello: {
          type: 'integer'
        }
      }
    }
  }
}

const paramsSchema = {
  schema: {
    params: {
      type: 'object',
      properties: {
        foo: {
          type: 'string'
        },
        test: {
          type: 'integer'
        }
      }
    }
  }
}

const headersSchema = {
  schema: {
    headers: {
      type: 'object',
      properties: {
        'x-test': {
          type: 'number'
        },
        'Y-Test': {
          type: 'number'
        }
      }
    }
  }
}

test('shorthand - get', t => {
  t.plan(1)
  try {
    fastify.register((instance, opts, done) => {
      instance.get('/', schema, function (req, reply) {
        reply.code(200).send({ hello: 'world' })
      });

      done();
    });
    t.pass()
  } catch (e) {
    t.fail()
  }
})

test('shorthand - get (return null)', t => {
  t.plan(1)
  try {
    fastify.register((instance, opts, done) => {
      instance.get('/null', nullSchema, function (req, reply) {
        reply.code(200).send(null)
      });

      done();
    });
    t.pass()
  } catch (e) {
    t.fail()
  }
})

test('shorthand - get params', t => {
  t.plan(1)
  try {
    fastify.register((instance, opts, done) => {
      instance.get('/params/:foo/:test', paramsSchema, function (req, reply) {
        reply.code(200).send(req.params)
      });

      done();
    });
    t.pass()
  } catch (e) {
    t.fail()
  }
})

test('shorthand - get, querystring schema', t => {
  t.plan(1)
  try {
    fastify.register((instance, opts, done) => {
      instance.get('/query', querySchema, function (req, reply) {
        reply.code(200).send(req.query)
      });

      done();
    });
    t.pass()
  } catch (e) {
    t.fail()
  }
})

test('shorthand - get, headers schema', t => {
  t.plan(1)
  try {
    fastify.register((instance, opts, done) => {
      instance.get('/headers', headersSchema, function (req, reply) {
        reply.code(200).send(req.headers)
      });

      done();
    });
    t.pass()
  } catch (e) {
    t.fail()
  }
})

test('missing schema - get', t => {
  t.plan(1)
  try {
    fastify.register((instance, opts, done) => {
      instance.get('/missing', function (req, reply) {
        reply.code(200).send({ hello: 'world' })
      });

      done();
    });
    t.pass()
  } catch (e) {
    t.fail()
  }
})

test('custom serializer - get', t => {
  t.plan(1)

  function customSerializer (data) {
    return JSON.stringify(data)
  }

  try {
    fastify.register((instance, opts, done) => {
      instance.get('/custom-serializer', numberSchema, function (req, reply) {
        reply.code(200).serializer(customSerializer).send({ hello: 'world' })
      });

      done();
    });
    t.pass()
  } catch (e) {
    t.fail()
  }
})

test('empty response', t => {
  t.plan(1)
  try {
    fastify.register((instance, opts, done) => {
      instance.get('/empty', function (req, reply) {
        reply.code(200).send()
      });

      done();
    });
    t.pass()
  } catch (e) {
    t.fail()
  }
})

test('send a falsy boolean', t => {
  t.plan(1)
  try {
    fastify.register((instance, opts, done) => {
      instance.get('/boolean', function (req, reply) {
        reply.code(200).send(false)
      });

      done();
    });
    t.pass()
  } catch (e) {
    t.fail()
  }
})

// A HEAD request to the /example endpoint will automatically respond with the same headers as the GET request.
fastify.listen(0, err => {
  t.error(err)
  fastify.server.unref()

  test('shorthand - request get', t => {
    t.plan(4)
    sget({
      method: 'GET',
      url: 'http://localhost:' + fastify.server.address().port
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(response.headers['content-length'], '' + body.length)
      t.same(JSON.parse(body), { hello: 'world' })
    })
  })

  test('shorthand - request get params schema', t => {
    t.plan(4)
    sget({
      method: 'GET',
      url: 'http://localhost:' + fastify.server.address().port + '/params/world/123'
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(response.headers['content-length'], '' + body.length)
      t.same(JSON.parse(body), { foo: 'world', test: 123 })
    })
  })

  test('shorthand - request get params schema error', t => {
    t.plan(3)
    sget({
      method: 'GET',
      url: 'http://localhost:' + fastify.server.address().port + '/params/world/string'
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 400)
      t.same(JSON.parse(body), {
        error: 'Bad Request',
        message: 'params.test should be integer',
        statusCode: 400
      })
    })
  })

  test('shorthand - request get headers schema', t => {
    t.plan(4)
    sget({
      method: 'GET',
      headers: {
        'x-test': '1',
        'Y-Test': '3'
      },
      json: true,
      url: 'http://localhost:' + fastify.server.address().port + '/headers'
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(body['x-test'], 1)
      t.equal(body['y-test'], 3)
    })
  })

  test('shorthand - request get headers schema error', t => {
    t.plan(3)
    sget({
      method: 'GET',
      headers: {
        'x-test': 'abc'
      },
      url: 'http://localhost:' + fastify.server.address().port + '/headers'
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 400)
      t.same(JSON.parse(body), {
        error: 'Bad Request',
        message: "headers['x-test'] should be number",
        statusCode: 400
      })
    })
  })

  test('shorthand - request get querystring schema', t => {
    t.plan(4)
    sget({
      method: 'GET',
      url: 'http://localhost:' + fastify.server.address().port + '/query?hello=123'
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(response.headers['content-length'], '' + body.length)
      t.same(JSON.parse(body), { hello: 123 })
    })
  })

  test('shorthand - request get querystring schema error', t => {
    t.plan(3)
    sget({
      method: 'GET',
      url: 'http://localhost:' + fastify.server.address().port + '/query?hello=world'
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 400)
      t.same(JSON.parse(body), {
        error: 'Bad Request',
        message: 'querystring.hello should be integer',
        statusCode: 400
      })
    })
  })

  test('shorthand - request get missing schema', t => {
    t.plan(4)
    sget({
      method: 'GET',
      url: 'http://localhost:' + fastify.server.address().port + '/missing'
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(response.headers['content-length'], '' + body.length)
      t.same(JSON.parse(body), { hello: 'world' })
    })
  })

  test('shorthand - custom serializer', t => {
    t.plan(4)
    sget({
      method: 'GET',
      url: 'http://localhost:' + fastify.server.address().port + '/custom-serializer'
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(response.headers['content-length'], '' + body.length)
      t.same(JSON.parse(body), { hello: 'world' })
    })
  })

  test('shorthand - empty response', t => {
    t.plan(4)
    sget({
      method: 'GET',
      url: 'http://localhost:' + fastify.server.address().port + '/empty'
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.equal(response.headers['content-length'], '0')
      t.same(body.toString(), '')
    })
  })

  test('shorthand - send a falsy boolean', t => {
    t.plan(3)
    sget({
      method: 'GET',
      url: 'http://localhost:' + fastify.server.address().port + '/boolean'
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.same(body.toString(), 'false')
    })
  })

  test('shorthand - send null value', t => {
    t.plan(3)
    sget({
      method: 'GET',
      url: 'http://localhost:' + fastify.server.address().port + '/null'
    }, (err, response, body) => {
      t.error(err)
      t.equal(response.statusCode, 200)
      t.same(body.toString(), 'null')
    })
  })
})

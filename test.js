const request = require('supertest')
const express = require('express')
const secureExpressRoutes = require('.')

const return200 = (req, res) => res.sendStatus(200);

function setup(middleware, routeArgs) {
  const app = express()
  app.use(middleware);
  app.get(...routeArgs)
  return app.listen(3000)
}

describe('secure-express-routes', () => {
  let server
  afterEach(() => {
    server.close()
  })
  it('should allow a route configured to return true to 200', async () => {
    const middleware = secureExpressRoutes({
      '/eleven': () => true,
    })
    server = setup(middleware, ['/eleven', return200])
    await request(server)
      .get('/eleven')
      .expect(200)
  })
  it('should 403 for a route configured to return false', async () => {
    const middleware = secureExpressRoutes({
      '/twelve': () => false,
    })
    server = setup(middleware, ['/twelve', return200])
    await request(server)
      .get('/twelve')
      .expect(403)
  })
  it('should pass the request to auth functions so they can use it to make decisions', async () => {
    const middleware = secureExpressRoutes({
      '/thirteen': () => (req) => req.query.letMeThrough,
    })
    server = setup(middleware, ['/thirteen', return200])
    await request(server)
      .get('/thirteen?letMeThrough=true')
      .expect(200)
  })
  it('should pass the response to auth functions so they can access res.locals', async () => {
    const middleware = [
      (req, res, next) => { res.locals.isAuthorised = true; next(); },
      secureExpressRoutes({
        '/fish': (req, res) => res.locals.isAuthorised,
      }),
    ]
    server = setup(middleware, ['/fish', return200])
    await request(server)
      .get('/fish')
      .expect(200)
  })
  it('should handle placeholders in the same way express does', async () => {
    const middleware = secureExpressRoutes({
      '/fourteen/:number': () => true,
    })
    server = setup(middleware, ['/fourteen/:number', return200])
    await request(server)
      .get('/fourteen/14')
      .expect(200)
  })
  it('should allow the response code to be configured', async () => {
    const middleware = secureExpressRoutes({
      '/fifteen': () => false,
    }, { responseCode: 404 })
    server = setup(middleware, ['/fifteen', return200])
    await request(server)
      .get('/fifteen')
      .expect(404)
  })
})

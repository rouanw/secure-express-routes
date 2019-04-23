const request = require('supertest')
const express = require('express')
const secureExpressRoutes = require('.')

const return200 = (req, res) => res.sendStatus(200);

function init() {
  const app = express()

  app.use(secureExpressRoutes({
    '/eleven': () => true,
    '/twelve': () => false,
    '/thirteen': (req) => req.query.letMeThrough,
  }))

  const router = express.Router()
  router.get('/eleven',return200)
  router.get('/twelve',return200)
  router.get('/thirteen',return200)
  app.use('/', router)
  return app.listen(3000)
}

describe('secure-express-routes', () => {
  let server
  beforeEach(() => {
    server = init()
  })
  afterEach(() => {
    server.close()
  })
  it('should allow a route configured to return true to 200', async () => {
    await request(server)
      .get('/eleven')
      .expect(200)
  })
  it('should 403 for a route configured to return false', async () => {
    await request(server)
      .get('/twelve')
      .expect(403)
  })
  it('should pass the request to auth functions so they can use it to make decisions', async () => {
    await request(server)
      .get('/thirteen?letMeThrough=true')
      .expect(200)
  })
})

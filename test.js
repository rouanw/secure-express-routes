const request = require('supertest')
const express = require('express')
const secureExpressRoutes = require('.')

function init() {
  const app = express()

  app.use(secureExpressRoutes({
    '/eleven': () => true,
    '/twelve': () => false,
  }))

  const router = express.Router()
  router.get('/eleven', (req,res, n) => {
    res.sendStatus(200)
  })
  router.get('/twelve', (req,res, n) => {
    res.sendStatus(200)
  })
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
})

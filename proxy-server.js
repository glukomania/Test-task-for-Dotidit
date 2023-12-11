const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  )
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  next()
})

app.use(
  '/graphql',
  createProxyMiddleware({
    target: 'https://stage.dotidot.io',
    changeOrigin: true,
  }),
)

const PORT = process.env.PORT || 1337

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`)
})

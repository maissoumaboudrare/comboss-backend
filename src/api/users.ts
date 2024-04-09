import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/users', (c) => c.text('Hello Node.js!'))
app.post('/users', async (c) => {
  const data = await c.req.json()
  console.log(data)
  return c.json(data)
})

const port = 3000
 
serve({
  fetch: app.fetch,
  port,
})
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { clerkMiddleware } from '@hono/clerk-auth';
import { shouldBeUser } from './middleware/authMiddleware.js';

const app = new Hono();
app.use('*', clerkMiddleware());

app.get('/health', (c) => {
  return c.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now()
  })
});

app.get('/test', shouldBeUser, (c) => {
  return c.json({
    message: "Payment Service is Authenticated",
    userId: c.get("userId")
  })
});

app.get("/", (c) => {
  return c.text('Payment endpoint is working!');
});

const start = async () => {
  try {
    serve({
      fetch: app.fetch,
      port: 8002
    }, (info) => {
      console.log(`Payment service is running on port: ${info.port}`)
    })
  } catch (error) {
    console.log('Error starting server:', error)
    process.exit(1);
  }
}

start();

import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import Clerk from "@clerk/fastify";
import { shouldBeUser } from './middleware/authMiddleware.js';
import { connectOrderDb } from '@repo/order-db';
import { orderRoute } from './routes/order.js';
const app = Fastify();
app.register(Clerk.clerkPlugin);

app.get('/healthcheck', (req: FastifyRequest, reply: FastifyReply) => {
    return reply.status(200).send({
      status: "ok",
      uptime: process.uptime(),
      timestamp: Date.now()
    });
});

app.get("/test", { preHandler: shouldBeUser }, (req: FastifyRequest, reply: FastifyReply) => {
    return reply.code(200).send({ message: "Order Service Authenticated", userId: req.userId});
});

app.register(orderRoute);

const start = async () => {
  try {
    await connectOrderDb();
    await app.listen({ port: 8001 });
    console.log("Order service is running on port 8001");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

import { FastifyReply, FastifyRequest } from "fastify";
import Clerk from "@clerk/fastify";
import type { CustomJwtSessionClaims } from "@repo/types";

declare module "fastify" {
    interface FastifyRequest {
        userId?: string;
    }
}

export const shouldBeUser = async (req: FastifyRequest, reply: FastifyReply) => {
    const { userId } = Clerk.getAuth(req);
    if(!userId) {
        return reply.code(401).send({ message: "You are not logged in"});
    }
    req.userId = userId;
}

export const shouldBeAdmin = async (req: FastifyRequest, reply: FastifyReply) => {
    const auth = Clerk.getAuth(req);
    if(!auth?.userId) {
        return reply.code(401).send({ message: "You are not logged in"});
    }
    const claims = auth.sessionClaims as CustomJwtSessionClaims;
    if(claims.metadata?.role !== "admin") {
        return reply.code(403).send({ message: "Unauthorized"});
    }
    req.userId = auth.userId;
}
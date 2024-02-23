import { FastifyReply, FastifyRequest } from "fastify";

export async function root(request: FastifyRequest, reply: FastifyReply) {
  reply.code(200).type("text/html").send("<h1> Fastify API System </h1>");
}

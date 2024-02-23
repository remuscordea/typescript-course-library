import { FastifyError, FastifyRequest, FastifyReply } from "fastify";

import { logger } from "../logger.js";

export function defaultErrorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  logger.error(`Internal server error - ${error}`);
  reply.code(500).send({ error: "Internal Server Error" });
}

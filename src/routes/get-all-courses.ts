import { FastifyReply, FastifyRequest } from "fastify";
import { logger } from "../logger.js";
import { AppDataSource } from "../data-source.js";
import { Course } from "../models/course.js";

export async function getAllCourses(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    logger.info("Called getAllCourses()");

    const courses = await AppDataSource.getRepository(Course)
      .createQueryBuilder("courses")
      // .leftJoinAndSelect("courses.lessons", "LESSONS")
      .orderBy("courses.seqNo")
      .getMany();

    reply.status(200).type("application/json").send({ courses });
  } catch (error) {
    logger.error("Error calling getAllCourses()");
    reply.status(500).send({ error: "Internal Server Error" });
  }
}

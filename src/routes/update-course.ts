import { FastifyReply, FastifyRequest } from "fastify";
import { logger } from "../logger.js";
import { isInteger } from "../utils.js";
import { AppDataSource } from "../data-source.js";
import { Course } from "../models/course.js";

interface RouteParams {
  courseId: string;
}

interface CourseChanges {
  title?: string;
}

export async function updateCourse(
  request: FastifyRequest<{ Params: RouteParams; Body: CourseChanges }>,
  reply: FastifyReply
) {
  try {
    logger.debug(`Called updateCourse()`);

    const { courseId } = request.params;
    const changes = request.body;

    if (!isInteger(courseId)) {
      throw `Invalid course id ${courseId}`;
    }

    await AppDataSource.createQueryBuilder()
      .update(Course)
      .set(changes)
      .where("id = :courseId", { courseId })
      .execute();

    reply
      .status(200)
      .type("application/json")
      .send({
        message: `Course ${courseId} was updated successfully.`,
      });
  } catch (error) {
    logger.error(`Error calling updateCourse()`);
    reply.status(500).send({ error: "Internal Server Error" });
  }
}

import { FastifyReply, FastifyRequest } from "fastify";
import { logger } from "../logger.js";
import { isInteger } from "../utils.js";
import { AppDataSource } from "../data-source.js";
import { Lesson } from "../models/lesson.js";
import { Course } from "../models/course.js";

interface RouteParams {
  courseId: string;
}

export async function deleteCourseAndLessons(
  request: FastifyRequest<{ Params: RouteParams }>,
  reply: FastifyReply
) {
  try {
    logger.debug(`Called deleteCourseAndLessons()`);

    const courseId = request.params.courseId;

    if (!isInteger(courseId)) {
      throw `Invalid courseId ${courseId}`;
    }

    await AppDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager
          .createQueryBuilder()
          .delete()
          .from(Lesson)
          .where("courseId = :courseId", { courseId })
          .execute();

        await transactionalEntityManager
          .createQueryBuilder()
          .delete()
          .from(Course)
          .where("id = :courseId", { courseId })
          .execute();
      }
    );

    reply
      .status(200)
      //   .type("application/json")
      .send({
        message: `Course deleted successfully ${courseId}`,
      });
  } catch (error) {
    logger.error(`Error calling deleteCourseAndLessons()`);
    reply.status(500).send({ error: "Internal Server Error" });
  }
}

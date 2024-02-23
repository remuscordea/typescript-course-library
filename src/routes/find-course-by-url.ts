import { FastifyReply, FastifyRequest } from "fastify";
import { logger } from "../logger.js";
import { AppDataSource } from "../data-source.js";
import { Course } from "../models/course.js";
import { Lesson } from "../models/lesson.js";

interface RouteParams {
  courseUrl: string;
}

export async function findCourseByUrl(
  request: FastifyRequest<{ Params: RouteParams }>,
  reply: FastifyReply
) {
  try {
    logger.info("Called findCourseByUrl()");

    const { courseUrl } = request.params;

    if (!courseUrl) {
      throw "Could not extract the course url from the request";
    }

    const course = await AppDataSource.getRepository(Course).findOneBy({
      url: courseUrl,
    });

    if (!course) {
      const message = `Could not find a course with url ${courseUrl}`;
      logger.error(message);
      reply.status(404).send({ message });
    }

    const totalLessons = await AppDataSource.getRepository(Lesson)
      .createQueryBuilder("lessons")
      .where("lessons.courseId = :courseId", {
        courseId: course.id,
      })
      .getCount();

    reply.status(200).type("application/json").send({
      course,
      totalLessons,
    });
  } catch (error) {
    logger.error("Error calling findCourseByUrl()");
    reply.status(500).send({ error: "Error retrieving course" });
  }
}

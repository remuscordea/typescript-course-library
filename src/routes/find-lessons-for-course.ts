import { FastifyReply, FastifyRequest } from "fastify";
import { logger } from "../logger.js";
import { isInteger } from "../utils.js";
import { AppDataSource } from "../data-source.js";
import { Lesson } from "../models/lesson.js";

interface RouteParams {
  courseId: string;
}

interface QueryParams {
  pageSize?: string;
  pageNumber?: string;
}

export async function findLessonsForCourse(
  request: FastifyRequest<{ Params: RouteParams; Querystring: QueryParams }>,
  reply: FastifyReply
) {
  try {
    logger.info("Called findLessonsForCourse()");

    const { courseId } = request.params;
    const query = request.query;
    const pageNumberValue = query?.pageNumber ?? "0";
    const pageNumber = parseInt(pageNumberValue);
    const pageSizeValue = query?.pageSize ?? "3";
    const pageSize = parseInt(pageSizeValue);

    if (!isInteger(courseId)) {
      throw `Invalid course id ${courseId}`;
    }
    if (!isInteger(pageNumberValue)) {
      throw `Invalid page number ${pageNumberValue}`;
    }
    if (!isInteger(pageSizeValue)) {
      throw `Invalid page size ${pageSizeValue}`;
    }

    const lessons = await AppDataSource.getRepository(Lesson)
      .createQueryBuilder("lessons")
      .where("lessons.courseId = :courseId", { courseId })
      .orderBy("lessons.seqNo")
      .skip(pageNumber * pageSize)
      .take(pageSize)
      .getMany();

    reply.status(200).type("application/json").send({ lessons });
  } catch (error) {
    logger.error("Error calling findLessonsForCourse()");
    reply.status(500).send({ error: "Error retrieving lesson" });
  }
}

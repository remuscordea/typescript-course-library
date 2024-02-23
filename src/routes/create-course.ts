import { FastifyReply, FastifyRequest } from "fastify";
import { logger } from "../logger.js";
import { AppDataSource } from "../data-source.js";
import { Course } from "../models/course.js";

type CourseChanges = Partial<Course>;

export async function createCourse(
  request: FastifyRequest<{ Body: CourseChanges }>,
  reply: FastifyReply
) {
  try {
    logger.debug(`Called createCourse()`);

    const data = request.body;

    if (!data) {
      throw `No data available, cannot save course.`;
    }

    const course = await AppDataSource.manager.transaction(
      "REPEATABLE READ",
      async (transactionalEntityManager) => {
        const repository = transactionalEntityManager.getRepository(Course);

        const result = await repository
          .createQueryBuilder("courses")
          .select("MAX(courses.seqNo)", "max")
          .getRawOne();

        const course = repository.create({
          ...data,
          seqNo: (result?.max ?? 0) + 1,
        });

        await repository.save(course);

        return course;
      }
    );

    reply.status(200).type("application/json").send({ course });
  } catch (error) {
    logger.error(`Error calling createCourse()`);
    reply.status(500).send({ error: "Internal Server Error" });
  }
}

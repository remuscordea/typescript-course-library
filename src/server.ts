import * as dotenv from "dotenv";
const env = dotenv.config();
if (env.error) {
  console.error("Error loading environment variables, aborting...");
  process.exit(1);
}

import "reflect-metadata";
import fastify from "fastify";
import cors from "@fastify/cors";
import { root } from "./routes/root.js";
import { isInteger } from "./utils.js";
import { logger } from "./logger.js";
import { AppDataSource } from "./data-source.js";
import { getAllCourses } from "./routes/get-all-courses.js";
import { defaultErrorHandler } from "./middlewares/default-error-handler.js";
import { findCourseByUrl } from "./routes/find-course-by-url.js";
import { findLessonsForCourse } from "./routes/find-lessons-for-course.js";
import { updateCourse } from "./routes/update-course.js";
import { createCourse } from "./routes/create-course.js";
import { deleteCourseAndLessons } from "./routes/delete-course.js";

let port = 3000;
const portEnv = process.env.PORT;
const host = process.env.HOST;

if (isInteger(portEnv)) {
  port = parseInt(portEnv);
}

AppDataSource.initialize()
  .then(() => {
    logger.info("The datasource has been initialized successfully.");

    const server = fastify();

    // CORS policy
    server.register(cors, { origin: true });

    // Routs
    server.get("/", root);
    server.get("/api/courses", getAllCourses);
    server.get("/api/courses/:courseUrl", findCourseByUrl);
    server.get("/api/courses/:courseId/lessons", findLessonsForCourse);
    server.patch("/api/courses/:courseId", updateCourse);
    server.post("/api/courses", createCourse);
    server.delete("/api/courses/:courseId", deleteCourseAndLessons);

    // Default error handler
    server.setErrorHandler(defaultErrorHandler);

    // Start server
    server.listen({ port, host }, (error, address) => {
      if (error) {
        logger.error(error);
        process.exit(1);
      }
      logger.info(`Server listening at ${address}`);
    });
  })
  .catch((err) => {
    logger.error(`Error during datasource initialization.`, err);
    process.exit(1);
  });

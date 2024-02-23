import * as dotenv from "dotenv";
const env = dotenv.config();

import "reflect-metadata";
import { AppDataSource } from "../data-source.js";
import { Lesson } from "./lesson.js";
import { Course } from "./course.js";

async function deleteDb() {
    await AppDataSource.initialize();
    console.log('Database connection ready.');

    console.log(`Cleaning LESSONS table`);
    await AppDataSource.getRepository(Lesson).delete({});

    console.log(`Cleaning COURSES table`);
    await AppDataSource.getRepository(Course).delete({});
}

deleteDb()
.then(() => {
    console.log(`Finished deleting DB`);
    process.exit(0);
})
.catch(err => {
    console.error(`Error deleting the DB.`, err)
});
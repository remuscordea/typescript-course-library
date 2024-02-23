import * as dotenv from "dotenv";
const env = dotenv.config();

import "reflect-metadata";
import { COURSES } from "./db-data.js";
import { AppDataSource } from "../data-source.js";
import { DeepPartial } from "typeorm";
import { Course } from "./course.js";
import { Lesson } from "./lesson.js";

async function populateDb() {
    await AppDataSource.initialize();
    console.log('Database connection ready.');

    const courses = Object.values(COURSES) as DeepPartial<Course>[];

    const courseRepository = AppDataSource.getRepository(Course);
    const lessonsRepository = AppDataSource.getRepository(Lesson);

    for (let courseData of courses) {
        console.log(`Inserting course ${courseData.title}`)

        const course = courseRepository.create(courseData);
        await courseRepository.save(course);

        for (let lessonData of courseData.lessons) {
            console.log(`Inserting lesson ${lessonData.title}`);

            const lesson = lessonsRepository.create(lessonData);
            lesson.course = course;
            await lessonsRepository.save(lesson);
        }
    }

    const totalCourses = await courseRepository.createQueryBuilder().getCount();
    const totalLessons = await lessonsRepository.createQueryBuilder().getCount();

    console.log(`Data Inserted - courses: ${totalCourses}, lessons: ${totalLessons}`);
}

populateDb()
.then(() => {
    console.log(`Finished populating DB`);
    process.exit(0);
})
.catch(err => {
    console.error(`Error populating the DB.`, err)
});
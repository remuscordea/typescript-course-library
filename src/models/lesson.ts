import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Course } from "./course.js";

@Entity({ name: "LESSONS" })
export class Lesson {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    title:string;

    @Column()
    duration:string;

    @Column()
    seqNo:number;

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    lastUpdatedAt:Date;

    @ManyToOne(() => Course, course => course.lessons)
    @JoinColumn({ name: "courseId" })
    course:Course;
}
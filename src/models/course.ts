import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Lesson } from "./lesson.js";

@Entity({ name: "COURSES" })
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  seqNo: number;

  @Column()
  title: string;

  @Column()
  url: string;

  @Column()
  iconUrl: string;

  @Column()
  longDescription: string;

  @Column()
  category: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  lastUpdatedAt: Date;

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Lesson[];
}

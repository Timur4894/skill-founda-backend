import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Roadmap } from "./roadmap.entity";
import { Task } from "./task.entity";
import { Resource } from "./resource.entity";
import { Documentation } from "./documentation.entity";

@Entity()
export class RoadmapItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  order: number;

  @OneToMany(() => Task, task => task.roadmapItem)
  tasks: Task[];

  @OneToMany(() => Resource, resource => resource.roadmapItem)
  resources: Resource[];

  @OneToMany(() => Documentation, doc => doc.roadmapItem)
  documentations: Documentation[];

  @ManyToOne(() => Roadmap, roadmap => roadmap.items)
  roadmap: Roadmap;
}

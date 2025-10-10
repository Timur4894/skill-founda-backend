import { Entity, PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm";
import { ManyToOne } from "typeorm";
import { RoadmapItem } from "./roadmap-item.entity";

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  link: string;

  @ManyToOne(() => RoadmapItem, item => item.resources)
  roadmapItem: RoadmapItem;
}

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ManyToOne } from "typeorm";
import { RoadmapItem } from "./roadmap-item.entity";

@Entity()
export class Documentation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  link: string;

  @ManyToOne(() => RoadmapItem, item => item.documentations)
  roadmapItem: RoadmapItem;

  @Column({ default: false })
  completed: boolean;
}
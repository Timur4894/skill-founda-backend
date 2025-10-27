import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm";
import { RoadmapItem } from "./roadmap-item.entity";
import { Progress } from "src/progress/entities/progress.entity";

@Entity()
export class Roadmap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, user => user.roadmap)
  user: User;

  @OneToMany(() => RoadmapItem, item => item.roadmap, { cascade: true })
  items: RoadmapItem[];

  @OneToOne(() => Progress, progress => progress.roadmap, { cascade: true })
  progress: Progress;
}

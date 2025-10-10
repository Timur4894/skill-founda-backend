import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { RoadmapItem } from "./roadmap-item.entity";

@Entity()
export class Roadmap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @OneToOne(() => User, user => user.roadmap)
  @JoinColumn()
  user: User;

  @OneToMany(() => RoadmapItem, item => item.roadmap, { cascade: true })
  items: RoadmapItem[];
}

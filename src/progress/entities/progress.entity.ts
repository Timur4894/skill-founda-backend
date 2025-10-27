import { Roadmap } from "src/roadmap/entities/roadmap.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Progress {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    totalPercentage: number;

    @Column({ default: 0 })
    totalTasks: number;

    @Column({ default: 0 })
    totalResources: number;

    @Column({ default: 0 })
    totalDocumentation: number;

    @Column({ default: 0 })
    tasksCompleted: number;

    @Column({ default: 0 })
    resourcesCompleted: number;

    @Column({ default: 0 })
    documentationCompleted: number;

    @Column({ nullable: true })
    roadmapId: number;

    @OneToOne(() => Roadmap, roadmap => roadmap.progress )
    @JoinColumn()
    roadmap: Roadmap;
}
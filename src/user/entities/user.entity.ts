import { Roadmap } from "src/roadmap/entities/roadmap.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
    id: string;

    @Column({unique: true})
    username: string;

    @Column({unique: true})
    email: string;

    @Column({nullable: true})
    profilePicture: string;

    @Column({nullable: true, type: 'text'})
    bio: string;

    @Column({nullable: true, type: 'simple-array'})
    skills: string[];

    @Column()
    password: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' , name: 'created_at'})
    createdAt: Date;

    @OneToMany(() => Roadmap, roadmap => roadmap.user, { cascade: true })
    roadmap: Roadmap;
}

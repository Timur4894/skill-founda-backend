import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Roadmap } from './entities/roadmap.entity';
import { RoadmapItem } from './entities/roadmap-item.entity';
import { Task } from './entities/task.entity';
import { Documentation } from './entities/documentation.entity';
import { Resource } from './entities/resource.entity';
import { RoadmapService } from './roadmap.service';
import { RoadmapController } from './roadmap.controller';
import { Progress } from 'src/progress/entities/progress.entity';
import { ProgressModule } from '../progress/progress.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Roadmap, RoadmapItem, Task, Documentation, Resource, Progress]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super_secret_key_REPLACELATER',
      signOptions: { expiresIn: '24h' },
    }),
    ProgressModule,
  ],
  controllers: [RoadmapController],
  providers: [RoadmapService],
  exports: [RoadmapService],
})
export class RoadmapModule {}

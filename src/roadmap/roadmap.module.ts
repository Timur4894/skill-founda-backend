import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roadmap } from './entities/roadmap.entity';
import { RoadmapItem } from './entities/roadmap-item.entity';
import { Task } from './entities/task.entity';
import { Documentation } from './entities/documentation.entity';
import { Resource } from './entities/resource.entity';
import { RoadmapService } from './roadmap.service';
import { RoadmapController } from './roadmap.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Roadmap, RoadmapItem, Task, Documentation, Resource])],
  controllers: [RoadmapController],
  providers: [RoadmapService],
  exports: [RoadmapService],
})
export class RoadmapModule {}

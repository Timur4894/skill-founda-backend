import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { Progress } from './entities/progress.entity';
import { Roadmap } from '../roadmap/entities/roadmap.entity';
import { RoadmapItem } from '../roadmap/entities/roadmap-item.entity';
import { Task } from '../roadmap/entities/task.entity';
import { Resource } from '../roadmap/entities/resource.entity';
import { Documentation } from '../roadmap/entities/documentation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Progress,
      Roadmap,
      RoadmapItem,
      Task,
      Resource,
      Documentation
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super_secret_key_REPLACELATER',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [ProgressService],
  controllers: [ProgressController],
  exports: [ProgressService]
})
export class ProgressModule {}

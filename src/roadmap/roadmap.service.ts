import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roadmap } from './entities/roadmap.entity';
import { RoadmapItem } from './entities/roadmap-item.entity';
import { Task } from './entities/task.entity';
import { Documentation } from './entities/documentation.entity';
import { Resource } from './entities/resource.entity';

@Injectable()
export class RoadmapService {
  constructor(
    @InjectRepository(Roadmap)
    private roadmapRepository: Repository<Roadmap>,
    @InjectRepository(RoadmapItem)
    private roadmapItemRepository: Repository<RoadmapItem>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Documentation)
    private documentationRepository: Repository<Documentation>,
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
  ) {}
}

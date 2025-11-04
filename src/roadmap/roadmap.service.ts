import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roadmap } from './entities/roadmap.entity';
import { RoadmapItem } from './entities/roadmap-item.entity';
import { Task } from './entities/task.entity';
import { Documentation } from './entities/documentation.entity';
import { Resource } from './entities/resource.entity';
import { Progress } from '../progress/entities/progress.entity';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import { CreateRoadmapItemDto } from './dto/create-roadmap-item.dto';
import { UpdateRoadmapItemDto } from './dto/update-roadmap-item.dto';
import { CreateRoadmapFromAiDto } from './dto/create-roadmap-from-ai.dto';
import { ProgressService } from 'src/progress/progress.service';

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
    @InjectRepository(Progress)
    private progressRepository: Repository<Progress>,

    // private progressService: ProgressService,
  ) {}

  // ========== ROADMAP METHODS ==========

  async createRoadmap(userId: string, createRoadmapDto: CreateRoadmapDto): Promise<Roadmap> {
    const roadmap = this.roadmapRepository.create({
      ...createRoadmapDto,
      user: { id: userId } as any,
    });
    const savedRoadmap = await this.roadmapRepository.save(roadmap);
    // const progress = await this.progressService.createInitialProgress(savedRoadmap.id);
    // console.log(progress);
    return savedRoadmap
  }

  async findAllRoadmaps(userId: string): Promise<Roadmap[]> {
    return await this.roadmapRepository.find({
      where: { user: { id: userId } },
      relations: ['items'],
      order: { id: 'ASC' },
    });
  }

  async findRoadmapById(id: number, userId: string): Promise<Roadmap> {
    const roadmap = await this.roadmapRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['items', 'items.tasks', 'items.documentations', 'items.resources'],
    });

    if (!roadmap) {
      throw new NotFoundException('Roadmap not found');
    }

    return roadmap;
  }

  async updateRoadmap(id: number, userId: string, updateRoadmapDto: UpdateRoadmapDto): Promise<Roadmap> {
    const roadmap = await this.findRoadmapById(id, userId);
    
    Object.assign(roadmap, updateRoadmapDto);
    return await this.roadmapRepository.save(roadmap);
  }

  async deleteRoadmap(id: number, userId: string): Promise<{ message: string }> {
    const roadmap = await this.findRoadmapById(id, userId);
    
    const roadmapItems = await this.roadmapItemRepository.find({
      where: { roadmap: { id } }
    });
    
    for (const item of roadmapItems) {
      await this.taskRepository.delete({ roadmapItem: { id: item.id } });
      await this.resourceRepository.delete({ roadmapItem: { id: item.id } });
      await this.documentationRepository.delete({ roadmapItem: { id: item.id } });
    }
    
    await this.roadmapItemRepository.delete({ roadmap: { id } });
    
    await this.progressRepository.delete({ roadmapId: id });
    
    await this.roadmapRepository.delete(id);
    
    return { message: 'Roadmap deleted successfully' };
  }

  async createRoadmapFromAi(userId: string, createRoadmapFromAiDto: CreateRoadmapFromAiDto): Promise<Roadmap> {
    const roadmap = this.roadmapRepository.create({
      title: createRoadmapFromAiDto.title,
      description: createRoadmapFromAiDto.description,
      user: { id: userId } as any,
    });
    
    const savedRoadmap = await this.roadmapRepository.save(roadmap);

    if (createRoadmapFromAiDto.items && createRoadmapFromAiDto.items.length > 0) {
      for (const itemData of createRoadmapFromAiDto.items) {
        const roadmapItem = this.roadmapItemRepository.create({
          title: itemData.title,
          description: itemData.description,
          order: itemData.order || 0,
          roadmap: { id: savedRoadmap.id } as any,
        });
        
        const savedRoadmapItem = await this.roadmapItemRepository.save(roadmapItem);

        // Создаем задачи
        if (itemData.tasks && itemData.tasks.length > 0) {
          for (const taskData of itemData.tasks) {
            const task = this.taskRepository.create({
              title: taskData.title,
              description: taskData.description,
              completed: false,
              roadmapItem: { id: savedRoadmapItem.id } as any,
            });
            await this.taskRepository.save(task);
          }
        }

        // Создаем документацию
        if (itemData.documentation && itemData.documentation.length > 0) {
          for (const docData of itemData.documentation) {
            const documentation = this.documentationRepository.create({
              title: docData.title,
              link: docData.link,
              roadmapItem: { id: savedRoadmapItem.id } as any,
            });
            await this.documentationRepository.save(documentation);
          }
        }

        if (itemData.resources && itemData.resources.length > 0) {
          for (const resourceData of itemData.resources) {
            const resource = this.resourceRepository.create({
              title: resourceData.title,
              link: resourceData.link,
              roadmapItem: { id: savedRoadmapItem.id } as any,
            });
            await this.resourceRepository.save(resource);
          }
        }
      }
    }

    // Возвращаем полный роадмап с созданными данными
    return await this.findRoadmapById(savedRoadmap.id, userId);
  }

  // ========== ROADMAP ITEM METHODS ==========

  async createRoadmapItem(roadmapId: number, userId: string, createRoadmapItemDto: CreateRoadmapItemDto): Promise<RoadmapItem> {
    await this.findRoadmapById(roadmapId, userId);

    if (createRoadmapItemDto.order === undefined) {
      const lastItem = await this.roadmapItemRepository.findOne({
        where: { roadmap: { id: roadmapId } },
        order: { order: 'DESC' },
      });
      createRoadmapItemDto.order = lastItem ? lastItem.order + 1 : 0;
    }

    const roadmapItem = this.roadmapItemRepository.create({
      ...createRoadmapItemDto,
      roadmap: { id: roadmapId } as any,
    });

    return await this.roadmapItemRepository.save(roadmapItem);
  }

  async findRoadmapItemById(id: number, userId: string): Promise<RoadmapItem> {
    const roadmapItem = await this.roadmapItemRepository.findOne({
      where: { id },
      relations: ['roadmap', 'roadmap.user', 'tasks', 'documentations', 'resources'],
    });

    if (!roadmapItem) {
      throw new NotFoundException('Roadmap item not found');
    }

    // Проверяем, что роадмап принадлежит пользователю
    if (roadmapItem.roadmap.user.id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return roadmapItem;
  }

  async updateRoadmapItem(id: number, userId: string, updateRoadmapItemDto: UpdateRoadmapItemDto): Promise<RoadmapItem> {
    const roadmapItem = await this.findRoadmapItemById(id, userId);
    
    Object.assign(roadmapItem, updateRoadmapItemDto);
    return await this.roadmapItemRepository.save(roadmapItem);
  }

  async deleteRoadmapItem(id: number, userId: string): Promise<{ message: string }> {
    const roadmapItem = await this.findRoadmapItemById(id, userId);
    
    // Удаляем все связанные объекты в правильном порядке
    // 1. Удаляем задачи, ресурсы и документацию
    await this.taskRepository.delete({ roadmapItem: { id } });
    await this.resourceRepository.delete({ roadmapItem: { id } });
    await this.documentationRepository.delete({ roadmapItem: { id } });
    
    // 2. Удаляем сам элемент роадмапа
    await this.roadmapItemRepository.delete(id);
    
    return { message: 'Roadmap item deleted successfully' };
  }

  async findAllRoadmapItems(roadmapId: number, userId: string): Promise<RoadmapItem[]> {
    await this.findRoadmapById(roadmapId, userId);

    return await this.roadmapItemRepository.find({
      where: { roadmap: { id: roadmapId } },
      relations: ['tasks', 'documentations', 'resources'],
      order: { order: 'ASC' },
    });
  }

  // ========== TASK METHODS ==========
  async markTaskAsCompleted(id: number, userId: string): Promise<{ message: string }> {
    const task = await this.taskRepository.findOne({ where: { id, roadmapItem: { roadmap: { user: { id: userId } } } } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    task.completed = true;
    await this.taskRepository.save(task);
    return { message: 'Task marked as completed' };
  }

  async markResourceAsCompleted(id: number, userId: string): Promise<{ message: string }> {
    const resource = await this.resourceRepository.findOne({ 
      where: { id, roadmapItem: { roadmap: { user: { id: userId } } } } 
    });
    if (!resource) {
      throw new NotFoundException('Resource not found');
    }
    resource.completed = true;
    await this.resourceRepository.save(resource);
    return { message: 'Resource marked as completed' };
  }

  async markDocumentationAsCompleted(id: number, userId: string): Promise<{ message: string }> {
    const documentation = await this.documentationRepository.findOne({ where: { id, roadmapItem: { roadmap: { user: { id: userId } } } } });
    if (!documentation) {
      throw new NotFoundException('Documentation not found');
    }
    documentation.completed = true;
    await this.documentationRepository.save(documentation);
    return { message: 'Documentation marked as completed' };
  }
}

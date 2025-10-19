import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roadmap } from './entities/roadmap.entity';
import { RoadmapItem } from './entities/roadmap-item.entity';
import { Task } from './entities/task.entity';
import { Documentation } from './entities/documentation.entity';
import { Resource } from './entities/resource.entity';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import { CreateRoadmapItemDto } from './dto/create-roadmap-item.dto';
import { UpdateRoadmapItemDto } from './dto/update-roadmap-item.dto';
import { CreateRoadmapFromAiDto } from './dto/create-roadmap-from-ai.dto';

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

  // ========== ROADMAP METHODS ==========

  async createRoadmap(userId: string, createRoadmapDto: CreateRoadmapDto): Promise<Roadmap> {
    const roadmap = this.roadmapRepository.create({
      ...createRoadmapDto,
      user: { id: userId } as any,
    });
    return await this.roadmapRepository.save(roadmap);
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
    await this.roadmapRepository.remove(roadmap);
    return { message: 'Roadmap deleted successfully' };
  }

  async createRoadmapFromAi(userId: string, createRoadmapFromAiDto: CreateRoadmapFromAiDto): Promise<Roadmap> {
    // Создаем основной роадмап
    const roadmap = this.roadmapRepository.create({
      title: createRoadmapFromAiDto.title,
      description: createRoadmapFromAiDto.description,
      user: { id: userId } as any,
    });
    
    const savedRoadmap = await this.roadmapRepository.save(roadmap);

    // Если есть блоки, создаем их
    if (createRoadmapFromAiDto.items && createRoadmapFromAiDto.items.length > 0) {
      for (const itemData of createRoadmapFromAiDto.items) {
        // Создаем блок роадмапа
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

        // Создаем ресурсы
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
    // Проверяем, что роадмап принадлежит пользователю
    await this.findRoadmapById(roadmapId, userId);

    // Если order не указан, ставим следующий номер
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
      relations: ['roadmap', 'tasks', 'documentations', 'resources'],
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
    await this.roadmapItemRepository.remove(roadmapItem);
    return { message: 'Roadmap item deleted successfully' };
  }

  async findAllRoadmapItems(roadmapId: number, userId: string): Promise<RoadmapItem[]> {
    // Проверяем, что роадмап принадлежит пользователю
    await this.findRoadmapById(roadmapId, userId);

    return await this.roadmapItemRepository.find({
      where: { roadmap: { id: roadmapId } },
      relations: ['tasks', 'documentations', 'resources'],
      order: { order: 'ASC' },
    });
  }
}

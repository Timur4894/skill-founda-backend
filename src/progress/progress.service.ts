import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from './entities/progress.entity';
import { Roadmap } from '../roadmap/entities/roadmap.entity';
import { RoadmapItem } from '../roadmap/entities/roadmap-item.entity';
import { Task } from '../roadmap/entities/task.entity';
import { Resource } from '../roadmap/entities/resource.entity';
import { Documentation } from '../roadmap/entities/documentation.entity';
import { ProgressResponseDto } from './dto/progress-response.dto';

@Injectable()
export class ProgressService {
    constructor(
        @InjectRepository(Progress)
        private progressRepository: Repository<Progress>,
        @InjectRepository(Roadmap)
        private roadmapRepository: Repository<Roadmap>,
        @InjectRepository(RoadmapItem)
        private roadmapItemRepository: Repository<RoadmapItem>,
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
        @InjectRepository(Resource)
        private resourceRepository: Repository<Resource>,
        @InjectRepository(Documentation)
        private documentationRepository: Repository<Documentation>,
    ) {}

    async getProgress(roadmapId: number): Promise<ProgressResponseDto> {
        // Проверяем существование роадмапа
        const roadmap = await this.roadmapRepository.findOne({
            where: { id: roadmapId }
        });

        if (!roadmap) {
            throw new NotFoundException(`Roadmap with ID ${roadmapId} not found`);
        }

        // Получаем или создаем прогресс (для хранения ID)
        let progress = await this.progressRepository.findOne({
            where: { roadmapId }
        });

        if (!progress) {
            progress = await this.createInitialProgress(roadmapId);
        }

        // Вычисляем прогресс на лету из реальных данных
        const calculatedProgress = await this.calculateProgressFromData(roadmapId);

        // Обновляем прогресс в БД для кеширования
        progress.totalTasks = calculatedProgress.totalTasks;
        progress.totalResources = calculatedProgress.totalResources;
        progress.totalDocumentation = calculatedProgress.totalDocumentation;
        progress.tasksCompleted = calculatedProgress.tasksCompleted;
        progress.resourcesCompleted = calculatedProgress.resourcesCompleted;
        progress.documentationCompleted = calculatedProgress.documentationCompleted;
        progress.totalPercentage = calculatedProgress.totalPercentage;
        await this.progressRepository.save(progress);

        // Возвращаем вычисленный прогресс
        return {
            id: progress.id,
            roadmapId: progress.roadmapId,
            totalPercentage: calculatedProgress.totalPercentage,
            totalTasks: calculatedProgress.totalTasks,
            totalResources: calculatedProgress.totalResources,
            totalDocumentation: calculatedProgress.totalDocumentation,
            tasksCompleted: calculatedProgress.tasksCompleted,
            resourcesCompleted: calculatedProgress.resourcesCompleted,
            documentationCompleted: calculatedProgress.documentationCompleted,
            tasksProgressPercentage: this.calculatePercentage(calculatedProgress.tasksCompleted, calculatedProgress.totalTasks),
            resourcesProgressPercentage: this.calculatePercentage(calculatedProgress.resourcesCompleted, calculatedProgress.totalResources),
            documentationProgressPercentage: this.calculatePercentage(calculatedProgress.documentationCompleted, calculatedProgress.totalDocumentation),
            roadmapItemsProgress: calculatedProgress.roadmapItemsProgress
        };
    }

    /**
     * Вычисляет прогресс на основе реальных данных из БД
     */
    private async calculateProgressFromData(roadmapId: number) {
        // Получаем все элементы роадмапа с их данными
        const roadmapItems = await this.roadmapItemRepository.find({
            where: { roadmap: { id: roadmapId } },
            relations: ['tasks', 'resources', 'documentations'],
            order: { order: 'ASC' }
        });

        // Инициализируем счетчики
        let totalTasks = 0;
        let totalResources = 0;
        let totalDocumentation = 0;
        let tasksCompleted = 0;
        let resourcesCompleted = 0;
        let documentationCompleted = 0;

        // Массив для детального прогресса по элементам
        const roadmapItemsProgress = roadmapItems.map(item => {
            // Подсчитываем задачи
            const itemTasks = item.tasks || [];
            const itemTasksCompleted = itemTasks.filter(task => task.completed === true).length;
            totalTasks += itemTasks.length;
            tasksCompleted += itemTasksCompleted;

            // Подсчитываем ресурсы
            const itemResources = item.resources || [];
            const itemResourcesCompleted = itemResources.filter(resource => resource.completed === true).length;
            totalResources += itemResources.length;
            resourcesCompleted += itemResourcesCompleted;

            // Подсчитываем документацию
            const itemDocumentations = item.documentations || [];
            const itemDocumentationsCompleted = itemDocumentations.filter(doc => doc.completed === true).length;
            totalDocumentation += itemDocumentations.length;
            documentationCompleted += itemDocumentationsCompleted;

            // Вычисляем процент для элемента
            const itemTotal = itemTasks.length + itemResources.length + itemDocumentations.length;
            let itemProgressPercentage = 0;
            if (itemTotal > 0) {
                const itemCompleted = itemTasksCompleted + itemResourcesCompleted + itemDocumentationsCompleted;
                itemProgressPercentage = Math.round((itemCompleted / itemTotal) * 100);
            }

            return {
                id: item.id,
                title: item.title,
                order: item.order,
                tasksCompleted: itemTasksCompleted,
                totalTasks: itemTasks.length,
                resourcesCompleted: itemResourcesCompleted,
                totalResources: itemResources.length,
                documentationCompleted: itemDocumentationsCompleted,
                totalDocumentation: itemDocumentations.length,
                itemProgressPercentage
            };
        });

        // Вычисляем общий процент
        const totalItems = totalTasks + totalResources + totalDocumentation;
        let totalPercentage = 0;
        if (totalItems > 0) {
            const completedItems = tasksCompleted + resourcesCompleted + documentationCompleted;
            totalPercentage = Math.round((completedItems / totalItems) * 100);
        }

        return {
            totalTasks,
            totalResources,
            totalDocumentation,
            tasksCompleted,
            resourcesCompleted,
            documentationCompleted,
            totalPercentage,
            roadmapItemsProgress
        };
    }

    async createInitialProgress(roadmapId: number): Promise<Progress> {
        const progress = this.progressRepository.create({
            roadmapId,
            totalPercentage: 0,
            totalTasks: 0,
            totalResources: 0,
            totalDocumentation: 0,
            tasksCompleted: 0,
            resourcesCompleted: 0,
            documentationCompleted: 0
        });

        return await this.progressRepository.save(progress);
    }

    /**
     * Обновляет прогресс на основе текущего состояния роадмапа
     * Публичный метод для вызова из других сервисов
     */
    async updateProgress(roadmapId: number): Promise<void> {
        // Вычисляем прогресс из реальных данных
        const calculatedProgress = await this.calculateProgressFromData(roadmapId);

        // Получаем существующий прогресс или создаем новый
        let progress = await this.progressRepository.findOne({
            where: { roadmapId }
        });

        if (!progress) {
            progress = this.progressRepository.create({ roadmapId });
        }

        // Обновляем значения
        progress.totalTasks = calculatedProgress.totalTasks;
        progress.totalResources = calculatedProgress.totalResources;
        progress.totalDocumentation = calculatedProgress.totalDocumentation;
        progress.tasksCompleted = calculatedProgress.tasksCompleted;
        progress.resourcesCompleted = calculatedProgress.resourcesCompleted;
        progress.documentationCompleted = calculatedProgress.documentationCompleted;
        progress.totalPercentage = calculatedProgress.totalPercentage;

        // Сохраняем прогресс
        await this.progressRepository.save(progress);
    }

    /**
     * Вычисляет процент выполнения
     */
    private calculatePercentage(completed: number, total: number): number {
        if (total === 0) return 0;
        return Math.round((completed / total) * 100);
    }

    async deleteProgress(progressId: number): Promise<Progress> {
        const progress = await this.progressRepository.findOne({ where: { id: progressId } });
        if (!progress) {
            throw new NotFoundException(`Progress with ID ${progressId} not found`);
        }
        await this.progressRepository.delete(progressId);
        return progress;
    }

}

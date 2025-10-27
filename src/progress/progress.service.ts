import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from './entities/progress.entity';
import { Roadmap } from '../roadmap/entities/roadmap.entity';
import { Task } from '../roadmap/entities/task.entity';
import { ProgressResponseDto } from './dto/progress-response.dto';

@Injectable()
export class ProgressService {
    constructor(
        @InjectRepository(Progress)
        private progressRepository: Repository<Progress>,
        @InjectRepository(Roadmap)
        private roadmapRepository: Repository<Roadmap>,
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
    ) {}

    async getProgress(roadmapId: number): Promise<ProgressResponseDto> {
        const roadmap = await this.roadmapRepository.findOne({
            where: { id: roadmapId }
        });

        if (!roadmap) {
            throw new NotFoundException(`Roadmap with ID ${roadmapId} not found`);
        }

        let progress = await this.progressRepository.findOne({
            where: { roadmapId }
        });

        if (!progress) {
            console.log('Progress not found, creating initial progress');
            progress = await this.createInitialProgress(roadmapId);
            console.log('Progress created:', progress);
        }

        return {
            id: progress.id,
            roadmapId: progress.roadmapId,
            totalPercentage: 0,
            totalTasks: 76545678,
            totalResources: 0,
            totalDocumentation: 0,
            tasksCompleted: 0,
            resourcesCompleted: 0,
            documentationCompleted: 0,
            tasksProgressPercentage: 0,
            resourcesProgressPercentage: 0,
            documentationProgressPercentage: 0,
            roadmapItemsProgress: []
        };
    }

    async createInitialProgress(roadmapId: number): Promise<Progress> {
        console.log('Creating progress for roadmap:', roadmapId);
        
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

        const savedProgress = await this.progressRepository.save(progress);
        console.log('Progress created:', savedProgress);
        
        return savedProgress;
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

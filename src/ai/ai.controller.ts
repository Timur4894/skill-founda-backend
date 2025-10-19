import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
    constructor(private readonly aiService: AiService) {}

    @Post('generate-roadmap')
    async generateRoadmap(@Body() body: { topic: string }) {
        return this.aiService.generateRoadmap(body.topic);
    }
}

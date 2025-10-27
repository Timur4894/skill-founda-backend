import { Controller, Get, Param, ParseIntPipe, Put, Body, UseGuards, Req } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressResponseDto } from './dto/progress-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('progress')
@UseGuards(JwtAuthGuard) 
export class ProgressController {
    constructor(private readonly progressService: ProgressService) {}


    @Get(':roadmapId')
    async getProgress(
        @Param('roadmapId', ParseIntPipe) roadmapId: number,
        @Req() req: any
    ): Promise<ProgressResponseDto> {
        return await this.progressService.getProgress(roadmapId);
    }


}

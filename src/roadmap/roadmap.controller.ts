import { Controller, Get, Post, Patch, Delete, Body, Param, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { RoadmapService } from './roadmap.service';
import { CreateRoadmapDto } from './dto/create-roadmap.dto';
import { UpdateRoadmapDto } from './dto/update-roadmap.dto';
import { CreateRoadmapItemDto } from './dto/create-roadmap-item.dto';
import { UpdateRoadmapItemDto } from './dto/update-roadmap-item.dto';
import { CreateRoadmapFromAiDto } from './dto/create-roadmap-from-ai.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('roadmap')
@UseGuards(JwtAuthGuard)
export class RoadmapController {
  constructor(private readonly roadmapService: RoadmapService) {}

  // ========== ROADMAP ENDPOINTS ==========

  @Post('create')
  async createRoadmap(@Req() req: any, @Body() createRoadmapDto: CreateRoadmapDto) {
    return this.roadmapService.createRoadmap(req.user.id, createRoadmapDto);
  }

  @Post('create-from-ai')
  async createRoadmapFromAi(@Req() req: any, @Body() createRoadmapFromAiDto: CreateRoadmapFromAiDto) {
    return this.roadmapService.createRoadmapFromAi(req.user.id, createRoadmapFromAiDto);
  }

  @Get('my')
  async getMyRoadmaps(@Req() req: any) {
    return this.roadmapService.findAllRoadmaps(req.user.id);
  }

  @Get(':id')
  async getRoadmapById(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.roadmapService.findRoadmapById(id, req.user.id);
  }

  @Patch(':id')
  async updateRoadmap(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoadmapDto: UpdateRoadmapDto
  ) {
    return this.roadmapService.updateRoadmap(id, req.user.id, updateRoadmapDto);
  }

  @Delete(':id')
  async deleteRoadmap(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.roadmapService.deleteRoadmap(id, req.user.id);
  }

  // ========== ROADMAP ITEM ENDPOINTS ==========

  @Post(':roadmapId/items')
  async createRoadmapItem(
    @Req() req: any,
    @Param('roadmapId', ParseIntPipe) roadmapId: number,
    @Body() createRoadmapItemDto: CreateRoadmapItemDto
  ) {
    return this.roadmapService.createRoadmapItem(roadmapId, req.user.id, createRoadmapItemDto);
  }

  @Get(':roadmapId/items')
  async getRoadmapItems(
    @Req() req: any,
    @Param('roadmapId', ParseIntPipe) roadmapId: number
  ) {
    return this.roadmapService.findAllRoadmapItems(roadmapId, req.user.id);
  }

  @Get('items/:id')
  async getRoadmapItemById(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.roadmapService.findRoadmapItemById(id, req.user.id);
  }

  @Patch('items/:id')
  async updateRoadmapItem(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoadmapItemDto: UpdateRoadmapItemDto
  ) {
    return this.roadmapService.updateRoadmapItem(id, req.user.id, updateRoadmapItemDto);
  }

  @Delete('items/:id')
  async deleteRoadmapItem(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.roadmapService.deleteRoadmapItem(id, req.user.id);
  }
}

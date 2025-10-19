import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';

@Module({
  imports: [SharedModule],
  providers: [AiService],
  controllers: [AiController]
})
export class AiModule {}

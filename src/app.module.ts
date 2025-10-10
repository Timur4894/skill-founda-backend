import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Roadmap } from './roadmap/entities/roadmap.entity';
import { RoadmapItem } from './roadmap/entities/roadmap-item.entity';
import { Task } from './roadmap/entities/task.entity';
import { Documentation } from './roadmap/entities/documentation.entity';
import { Resource } from './roadmap/entities/resource.entity';
import { AuthModule } from './auth/auth.module';
import { RoadmapModule } from './roadmap/roadmap.module';
import { ProgressModule } from './progress/progress.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'timurlatus',
        password: '556055',
        database: 'myapp',
        entities: [User, Roadmap, RoadmapItem, Task, Documentation, Resource],
        synchronize: true,
      }),
    UserModule,
    AuthModule,
    RoadmapModule,
    ProgressModule,
    AiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

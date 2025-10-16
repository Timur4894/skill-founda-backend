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
import { SupabaseModule } from './supabase/ supabase.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || 'timurlatus',
        password: process.env.DB_PASSWORD || '556055',
        database: process.env.DB_DATABASE || 'myapp',
        entities: [User, Roadmap, RoadmapItem, Task, Documentation, Resource],
        synchronize: false,
        ssl: { rejectUnauthorized: false },
      }),
    UserModule,
    AuthModule,
    RoadmapModule,
    ProgressModule,
    AiModule,
    SupabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  constructor() {
    console.log(`📦 Connected to DB: ${process.env.DB_HOST}`);
    console.log(`🔑 SUPABASE_URL: ${process.env.SUPABASE_URL ? 'SET' : 'NOT SET'}`);
    console.log(`🔑 SUPABASE_KEY: ${process.env.SUPABASE_KEY ? 'SET' : 'NOT SET'}`);
    console.log(`🔑 JWT_SECRET: ${process.env.JWT_SECRET ? 'SET' : 'NOT SET'}`);
  }
}

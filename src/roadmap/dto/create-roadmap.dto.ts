import { IsNotEmpty, IsString, IsOptional, MinLength } from 'class-validator';

export class CreateRoadmapDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}

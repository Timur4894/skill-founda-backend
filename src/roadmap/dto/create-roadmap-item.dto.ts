import { IsNotEmpty, IsString, IsOptional, MinLength, IsNumber, Min } from 'class-validator';

export class CreateRoadmapItemDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;
}

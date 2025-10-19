import { IsOptional, IsString, MinLength, IsNumber, Min } from 'class-validator';

export class UpdateRoadmapItemDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;
}

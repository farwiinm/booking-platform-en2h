import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  IsPositive,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ example: 'Deep Tissue Massage' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ example: '60 minute full body massage' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 60, description: 'Duration in minutes' })
  @IsNumber()
  @IsPositive()
  duration!: number;

  @ApiProperty({ example: 80.0 })
  @IsNumber()
  @IsPositive()
  price!: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  IsPositive,
} from 'class-validator';
export class CreateServiceDto {
  @IsString()
  title!: string;
  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  duration!: number; // in minutes

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

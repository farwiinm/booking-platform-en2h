import {
  IsString,
  IsEmail,
  IsNumber,
  IsDateString,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  customerName!: string;

  @IsEmail()
  customerEmail!: string;

  @IsString()
  @IsOptional()
  customerPhone?: string;

  @IsNumber()
  serviceId!: number;

  @IsDateString()
  bookingDate!: string;

  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'bookingTime must be in HH:MM format',
  })
  bookingTime!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

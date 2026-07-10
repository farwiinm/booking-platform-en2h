import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './booking.entity';
import { ServicesService } from '../services/services.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private servicesService: ServicesService,
  ) {}

  findAll() {
    return this.bookingRepository.find();
  }

  async findOne(id: number) {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async create(dto: CreateBookingDto) {
    // RULE 1: The service must exist
    await this.servicesService.findOne(dto.serviceId);

    // RULE 2: Booking date cannot be in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(dto.bookingDate);
    if (bookingDate < today) {
      throw new BadRequestException('Booking date cannot be in the past');
    }

    // RULE 3: No duplicate booking for same service, date, and time
    const duplicate = await this.bookingRepository.findOne({
      where: {
        serviceId: dto.serviceId,
        bookingDate: dto.bookingDate,
        bookingTime: dto.bookingTime,
      },
    });
    if (duplicate) {
      throw new ConflictException(
        'This time slot is already booked for the selected service',
      );
    }

    // All rules passed — save the booking
    const booking = this.bookingRepository.create(dto);
    return this.bookingRepository.save(booking);
  }

  async updateStatus(id: number, dto: UpdateBookingStatusDto) {
    const booking = await this.findOne(id);

    // RULE 3: A cancelled booking cannot be marked as completed
    if (
      booking.status === BookingStatus.CANCELLED &&
      dto.status === BookingStatus.COMPLETED
    ) {
      throw new BadRequestException(
        'A cancelled booking cannot be marked as completed',
      );
    }

    booking.status = dto.status;
    return this.bookingRepository.save(booking);
  }

  async remove(id: number) {
    const booking = await this.findOne(id);
    booking.status = BookingStatus.CANCELLED;
    await this.bookingRepository.save(booking);
    return { message: `Booking ${id} has been cancelled` };
  }
}

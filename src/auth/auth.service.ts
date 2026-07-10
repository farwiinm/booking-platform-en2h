import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // ── REGISTER ──────────────────────────────────────────────────────
  async register(dto: RegisterDto) {
    // 1. Check if email is already taken
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    // 2. Hash the password (higher = slower but safer)
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Create and save the user
    const user = this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    });
    await this.userRepository.save(user);

    // 4. Return a safe response (never return the password)
    return { message: 'Registration successful' };
  }

  // ── LOGIN ─────────────────────────────────────────────────────────
  async login(dto: LoginDto) {
    // 1. Find user by email
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Compare password with the stored hash
    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Build the JWT payload and sign the token
    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    // 4. Return the token
    return { access_token: token };
  }
}

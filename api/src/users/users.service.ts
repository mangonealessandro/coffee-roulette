import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async updateProfile(userId: number, dto: UpdateProfileDto): Promise<User> {
    const user = await this.findById(userId);
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.avatar_url !== undefined) user.avatarUrl = dto.avatar_url;
    const updated = await this.userRepository.save(user);
    this.logger.log(`Profile updated for user #${userId}`);
    return updated;
  }

  async setAvailability(userId: number, isAvailable: number): Promise<User> {
    const user = await this.findById(userId);
    user.isAvailable = isAvailable;
    const updated = await this.userRepository.save(user);
    this.logger.log(`User #${userId} availability set to ${isAvailable}`);
    return updated;
  }

  sanitize(user: User): Omit<User, 'passwordHash'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...rest } = user;
    return rest;
  }
}

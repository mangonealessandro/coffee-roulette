import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../database/entities/user.entity';

const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  passwordHash: 'hash',
  name: 'Test User',
  avatarUrl: null,
  isAvailable: 1,
  createdAt: new Date().toISOString(),
  matchesAsUserOne: [],
  matchesAsUserTwo: [],
};

const mockUserRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.findById(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('should update name and return sanitized user', async () => {
      mockUserRepository.findOne.mockResolvedValue({ ...mockUser });
      mockUserRepository.save.mockResolvedValue({ ...mockUser, name: 'New Name' });

      const result = await service.updateProfile(1, { name: 'New Name' });
      expect(result.name).toBe('New Name');
    });

    it('should update avatarUrl', async () => {
      mockUserRepository.findOne.mockResolvedValue({ ...mockUser });
      const url = 'https://example.com/avatar.png';
      mockUserRepository.save.mockResolvedValue({ ...mockUser, avatarUrl: url });

      const result = await service.updateProfile(1, { avatar_url: url });
      expect(result.avatarUrl).toBe(url);
    });
  });

  describe('setAvailability', () => {
    it('should set user availability to 0', async () => {
      mockUserRepository.findOne.mockResolvedValue({ ...mockUser });
      mockUserRepository.save.mockResolvedValue({ ...mockUser, isAvailable: 0 });

      const result = await service.setAvailability(1, 0);
      expect(result.isAvailable).toBe(0);
    });

    it('should set user availability to 1', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        ...mockUser,
        isAvailable: 0,
      });
      mockUserRepository.save.mockResolvedValue({ ...mockUser, isAvailable: 1 });

      const result = await service.setAvailability(1, 1);
      expect(result.isAvailable).toBe(1);
    });
  });

  describe('sanitize', () => {
    it('should remove passwordHash from user object', () => {
      const sanitized = service.sanitize(mockUser);
      expect(sanitized).not.toHaveProperty('passwordHash');
      expect(sanitized).toHaveProperty('email');
      expect(sanitized).toHaveProperty('name');
    });
  });
});

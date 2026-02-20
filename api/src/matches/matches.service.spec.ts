import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { Match } from '../database/entities/match.entity';
import { User } from '../database/entities/user.entity';

const mockUser = (id: number, available = 1): User => ({
  id,
  email: `user${id}@example.com`,
  passwordHash: 'hash',
  name: `User ${id}`,
  avatarUrl: null,
  isAvailable: available,
  createdAt: new Date().toISOString(),
  matchesAsUserOne: [],
  matchesAsUserTwo: [],
});

const mockMatch = (id: number, userOneId: number, userTwoId: number): Match => ({
  id,
  userOneId,
  userTwoId,
  type: 'weekly',
  status: 'pending',
  matchedAt: new Date().toISOString(),
  completedAt: null,
  userOne: mockUser(userOneId),
  userTwo: mockUser(userTwoId),
});

const mockMatchRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const mockUserRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
};

describe('MatchesService', () => {
  let service: MatchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        { provide: getRepositoryToken(Match), useValue: mockMatchRepository },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
    jest.clearAllMocks();
  });

  describe('getUserMatches', () => {
    it('should return formatted matches for user', async () => {
      const match = mockMatch(1, 1, 2);
      mockMatchRepository.find.mockResolvedValue([match]);

      const result = await service.getUserMatches(1);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('partner');
      expect(result[0].partner.id).toBe(2);
    });

    it('should return empty array when no matches', async () => {
      mockMatchRepository.find.mockResolvedValue([]);
      const result = await service.getUserMatches(1);
      expect(result).toHaveLength(0);
    });
  });

  describe('createOnDemandMatch', () => {
    it('should create a match with an available user', async () => {
      const currentUser = mockUser(1, 1);
      const partner = mockUser(2, 1);
      const createdMatch = mockMatch(10, 1, 2);
      createdMatch.type = 'on_demand';

      mockUserRepository.findOne.mockResolvedValue(currentUser);
      mockMatchRepository.find.mockResolvedValue([]);
      mockUserRepository.find.mockResolvedValue([partner]);
      mockMatchRepository.create.mockReturnValue(createdMatch);
      mockMatchRepository.save.mockResolvedValue(createdMatch);
      mockMatchRepository.findOne.mockResolvedValue(createdMatch);

      const result = await service.createOnDemandMatch(1);

      expect(result).toHaveProperty('partner');
      expect(result.partner.id).toBe(2);
    });

    it('should throw NotFoundException when no available users', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser(1, 1));
      mockMatchRepository.find.mockResolvedValue([]);
      mockUserRepository.find.mockResolvedValue([]);

      await expect(service.createOnDemandMatch(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when user is not available', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser(1, 0));

      await expect(service.createOnDemandMatch(1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('completeMatch', () => {
    it('should mark match as completed', async () => {
      const match = mockMatch(1, 1, 2);
      const completedMatch = {
        ...match,
        status: 'completed' as const,
        completedAt: new Date().toISOString(),
      };

      mockMatchRepository.findOne
        .mockResolvedValueOnce(match)
        .mockResolvedValueOnce(completedMatch);
      mockMatchRepository.save.mockResolvedValue(completedMatch);

      const result = await service.completeMatch(1, 1);
      expect(result.status).toBe('completed');
    });

    it('should throw NotFoundException for non-existent match', async () => {
      mockMatchRepository.findOne.mockResolvedValue(null);

      await expect(service.completeMatch(999, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for already completed match', async () => {
      const match = {
        ...mockMatch(1, 1, 2),
        status: 'completed' as const,
      };
      mockMatchRepository.findOne.mockResolvedValue(match);

      await expect(service.completeMatch(1, 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('skipMatch', () => {
    it('should mark match as skipped', async () => {
      const match = mockMatch(1, 1, 2);
      const skippedMatch = { ...match, status: 'skipped' as const };

      mockMatchRepository.findOne
        .mockResolvedValueOnce(match)
        .mockResolvedValueOnce(skippedMatch);
      mockMatchRepository.save.mockResolvedValue(skippedMatch);

      const result = await service.skipMatch(1, 1);
      expect(result.status).toBe('skipped');
    });
  });
});

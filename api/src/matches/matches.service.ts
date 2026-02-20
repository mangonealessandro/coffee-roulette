import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { Match } from '../database/entities/match.entity';
import { User } from '../database/entities/user.entity';

export interface MatchWithPartner {
  id: number;
  type: string;
  status: string;
  matchedAt: string;
  completedAt: string | null;
  partner: {
    id: number;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
}

@Injectable()
export class MatchesService {
  private readonly logger = new Logger(MatchesService.name);

  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserMatches(userId: number): Promise<MatchWithPartner[]> {
    const matches = await this.matchRepository.find({
      where: [{ userOneId: userId }, { userTwoId: userId }],
      relations: ['userOne', 'userTwo'],
      order: { matchedAt: 'DESC' },
    });

    return matches.map((match) => this.formatMatch(match, userId));
  }

  async createOnDemandMatch(currentUserId: number): Promise<MatchWithPartner> {
    const currentUser = await this.userRepository.findOne({
      where: { id: currentUserId },
    });

    if (!currentUser || !currentUser.isAvailable) {
      throw new BadRequestException(
        'You must be available to request a coffee match',
      );
    }

    // Find users already matched with current user this week
    const weekStart = this.getWeekStart();
    const existingMatches = await this.matchRepository.find({
      where: [
        { userOneId: currentUserId, matchedAt: Not('') },
        { userTwoId: currentUserId, matchedAt: Not('') },
      ],
    });

    const alreadyMatchedIds = existingMatches
      .filter((m) => new Date(m.matchedAt) >= weekStart)
      .map((m) =>
        m.userOneId === currentUserId ? m.userTwoId : m.userOneId,
      );

    // Find available users, excluding current user and already-matched this week
    const excludedIds = [currentUserId, ...alreadyMatchedIds];
    const availableUsers = await this.userRepository.find({
      where: {
        isAvailable: 1,
        id: Not(In(excludedIds)),
      },
    });

    if (availableUsers.length === 0) {
      throw new NotFoundException('No available users at this time');
    }

    // Random pick
    const partner =
      availableUsers[Math.floor(Math.random() * availableUsers.length)];

    const match = this.matchRepository.create({
      userOneId: currentUserId,
      userTwoId: partner.id,
      type: 'on_demand',
      status: 'pending',
    });

    const saved = await this.matchRepository.save(match);
    this.logger.log(
      `On-demand match created: user #${currentUserId} ↔ user #${partner.id}`,
    );

    const full = await this.matchRepository.findOne({
      where: { id: saved.id },
      relations: ['userOne', 'userTwo'],
    });

    if (!full) throw new NotFoundException('Match not found after creation');
    return this.formatMatch(full, currentUserId);
  }

  async completeMatch(matchId: number, userId: number): Promise<MatchWithPartner> {
    const match = await this.findMatchForUser(matchId, userId);

    if (match.status !== 'pending') {
      throw new BadRequestException(
        `Cannot complete a match with status '${match.status}'`,
      );
    }

    match.status = 'completed';
    match.completedAt = new Date().toISOString();
    await this.matchRepository.save(match);

    const full = await this.matchRepository.findOne({
      where: { id: match.id },
      relations: ['userOne', 'userTwo'],
    });

    if (!full) throw new NotFoundException('Match not found');
    this.logger.log(`Match #${matchId} completed by user #${userId}`);
    return this.formatMatch(full, userId);
  }

  async skipMatch(matchId: number, userId: number): Promise<MatchWithPartner> {
    const match = await this.findMatchForUser(matchId, userId);

    if (match.status !== 'pending') {
      throw new BadRequestException(
        `Cannot skip a match with status '${match.status}'`,
      );
    }

    match.status = 'skipped';
    await this.matchRepository.save(match);

    const full = await this.matchRepository.findOne({
      where: { id: match.id },
      relations: ['userOne', 'userTwo'],
    });

    if (!full) throw new NotFoundException('Match not found');
    this.logger.log(`Match #${matchId} skipped by user #${userId}`);
    return this.formatMatch(full, userId);
  }

  async createWeeklyMatches(): Promise<void> {
    this.logger.log('Starting weekly match creation...');

    const availableUsers = await this.userRepository.find({
      where: { isAvailable: 1 },
    });

    // Shuffle and pair users
    const shuffled = [...availableUsers].sort(() => Math.random() - 0.5);
    const pairs: [User, User][] = [];

    for (let i = 0; i < shuffled.length - 1; i += 2) {
      pairs.push([shuffled[i], shuffled[i + 1]]);
    }

    const matches = pairs.map(([userOne, userTwo]) =>
      this.matchRepository.create({
        userOneId: userOne.id,
        userTwoId: userTwo.id,
        type: 'weekly',
        status: 'pending',
      }),
    );

    await this.matchRepository.save(matches);
    this.logger.log(
      `Weekly matching done: ${pairs.length} pairs created from ${availableUsers.length} users`,
    );
  }

  private async findMatchForUser(matchId: number, userId: number): Promise<Match> {
    const match = await this.matchRepository.findOne({
      where: [
        { id: matchId, userOneId: userId },
        { id: matchId, userTwoId: userId },
      ],
    });

    if (!match) {
      throw new NotFoundException(`Match #${matchId} not found`);
    }

    return match;
  }

  private formatMatch(match: Match, currentUserId: number): MatchWithPartner {
    const partner =
      match.userOneId === currentUserId ? match.userTwo : match.userOne;

    return {
      id: match.id,
      type: match.type,
      status: match.status,
      matchedAt: match.matchedAt,
      completedAt: match.completedAt,
      partner: {
        id: partner.id,
        name: partner.name,
        email: partner.email,
        avatarUrl: partner.avatarUrl,
      },
    };
  }

  private getWeekStart(): Date {
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 1=Mon...
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  }
}

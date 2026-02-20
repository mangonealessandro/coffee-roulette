import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MatchesService } from './matches.service';

@Injectable()
export class MatchesCron {
  private readonly logger = new Logger(MatchesCron.name);

  constructor(private readonly matchesService: MatchesService) {}

  // Every Monday at 9:00 AM
  @Cron('0 9 * * 1')
  async handleWeeklyMatching() {
    this.logger.log('Running weekly coffee match cron job');
    try {
      await this.matchesService.createWeeklyMatches();
    } catch (err) {
      this.logger.error('Weekly matching failed:', err);
    }
  }
}

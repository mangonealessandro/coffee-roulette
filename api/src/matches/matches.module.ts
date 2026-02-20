import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '../database/entities/match.entity';
import { User } from '../database/entities/user.entity';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { MatchesCron } from './matches.cron';

@Module({
  imports: [TypeOrmModule.forFeature([Match, User])],
  controllers: [MatchesController],
  providers: [MatchesService, MatchesCron],
  exports: [MatchesService],
})
export class MatchesModule {}

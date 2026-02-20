import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../database/entities/user.entity';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  getMatches(@CurrentUser() user: User) {
    return this.matchesService.getUserMatches(user.id);
  }

  @Post('on-demand')
  @HttpCode(HttpStatus.CREATED)
  createOnDemand(@CurrentUser() user: User) {
    return this.matchesService.createOnDemandMatch(user.id);
  }

  @Patch(':id/complete')
  completeMatch(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.matchesService.completeMatch(id, user.id);
  }

  @Patch(':id/skip')
  skipMatch(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.matchesService.skipMatch(id, user.id);
  }
}

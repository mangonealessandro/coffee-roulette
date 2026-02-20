import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ToggleAvailabilityDto } from './dto/toggle-availability.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../database/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@CurrentUser() user: User) {
    return this.usersService.sanitize(user);
  }

  @Patch('me')
  updateProfile(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.id, dto).then((u) =>
      this.usersService.sanitize(u),
    );
  }

  @Patch('me/availability')
  toggleAvailability(
    @CurrentUser() user: User,
    @Body() dto: ToggleAvailabilityDto,
  ) {
    return this.usersService
      .setAvailability(user.id, dto.is_available)
      .then((u) => this.usersService.sanitize(u));
  }
}

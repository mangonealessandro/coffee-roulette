import { IsIn, IsInt } from 'class-validator';

export class ToggleAvailabilityDto {
  @IsInt()
  @IsIn([0, 1], { message: 'is_available must be 0 or 1' })
  is_available: number;
}

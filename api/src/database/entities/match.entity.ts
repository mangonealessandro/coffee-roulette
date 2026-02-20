import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export type MatchType = 'weekly' | 'on_demand';
export type MatchStatus = 'pending' | 'completed' | 'skipped';

@Entity('matches')
@Index(['userOneId', 'userTwoId'])
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_one_id' })
  userOneId: number;

  @Column({ name: 'user_two_id' })
  userTwoId: number;

  @Column({ type: 'text' })
  type: MatchType;

  @Column({ type: 'text', default: 'pending' })
  status: MatchStatus;

  @CreateDateColumn({ name: 'matched_at', type: 'text' })
  matchedAt: string;

  @Column({ name: 'completed_at', type: 'text', nullable: true })
  completedAt: string | null;

  @ManyToOne(() => User, (user) => user.matchesAsUserOne)
  @JoinColumn({ name: 'user_one_id' })
  userOne: User;

  @ManyToOne(() => User, (user) => user.matchesAsUserTwo)
  @JoinColumn({ name: 'user_two_id' })
  userTwo: User;
}

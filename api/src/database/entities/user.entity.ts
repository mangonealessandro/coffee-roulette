import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Match } from './match.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'text' })
  passwordHash: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ name: 'avatar_url', type: 'text', nullable: true })
  avatarUrl: string | null;

  @Column({ name: 'is_available', type: 'integer', default: 1 })
  isAvailable: number;

  @CreateDateColumn({ name: 'created_at', type: 'text' })
  createdAt: string;

  @OneToMany(() => Match, (match) => match.userOne)
  matchesAsUserOne: Match[];

  @OneToMany(() => Match, (match) => match.userTwo)
  matchesAsUserTwo: Match[];
}

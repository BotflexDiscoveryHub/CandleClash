import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { GameSessionEntity } from './game-session.entry';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  telegramId: string;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  username: string;

  @Column()
  languageCode: string;

  @Column({ default: 0 })
  pointsBalance: number;

  @Column({ nullable: true })
  referrer: string;

  @Column({ default: 0 })
  friendsCount: number;

  @Column({ default: 0 })
  lastRequestAt: number;

  @Column({ default: 3 })
  liquidityPools: number;

  @Column({ nullable: true })
  liquidityPoolsUpdateDate: string;

  @Column({ default: 100 })
  liquidity: number;

  @Column({ type: 'simple-json', default: [] })
  datesOfVisits: string[];

  @Column({ type: 'simple-json', default: [] })
  rewards: string[];

  @OneToMany(() => GameSessionEntity, (session) => session.user, {
    cascade: true,
  })
  sessions: GameSessionEntity[];

  @Column({ default: 0 })
  collectedItems: number;

  @Column({ default: 1 })
  level: number;

  @Column({ nullable: true })
  lastLevelUpDate: string;

  // @Column({ type: 'simple-json', default: [] })
  // activeChallenges: { challengeId: string; startedAt: string }[];

  @Column({ type: 'simple-json', default: [] })
  completedChallenges: string[];

  @CreateDateColumn()
  createdAt: Date;
}

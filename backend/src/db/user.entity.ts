import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { GameSessionEntity } from './game-session.entry';
import { RewardProgressDto } from '../rewards/dto/reward-progress.dto';

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

  @Column({ type: 'simple-json', default: [] })
  rewardsProgress: RewardProgressDto[];

  @OneToMany(() => GameSessionEntity, (session) => session.user, {
    cascade: true,
    eager: true,
  })
  sessions: GameSessionEntity[];

  @Column({ default: 0 })
  collectedItems: number;

  @Column({ default: 1 })
  level: number;

  @Column({ nullable: true })
  lastLevelUpDate: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  activeBoost?: string; // Тип активного буста, например, "points" или "liquidity"

  @Column({ type: 'float', nullable: true })
  boostMultiplier?: number; // Множитель буста, например, 2 для x2 или 1.2 для 20% увеличения

  @Column({ type: 'boolean', nullable: true })
  isBoostPercentage?: boolean; // Указывает, является ли буст процентным

  @Column({ type: 'timestamp', nullable: true })
  boostExpiration?: Date; // Время истечения активного буста

  @CreateDateColumn()
  createdAt: Date;
}

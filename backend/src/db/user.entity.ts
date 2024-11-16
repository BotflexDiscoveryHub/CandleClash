import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { GameSessionEntity } from './game-session.entry';
import {
  BoostUserDto,
  RewardUserDto,
} from '../rewards/dto/reward-progress.dto';

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

  @Column({ nullable: true })
  inviteLink: string;

  @Column({ default: 0 })
  friendsCount: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  lastRequestAt: Date;

  @Column({ default: 100 })
  liquidity: number;

  @Column({ default: 5 })
  dailyLiquidityPools: number;

  @Column({ default: 0 })
  giftLiquidityPools: number;

  @Column({ type: 'simple-json', default: [] })
  datesOfVisits: string[];

  @Column({ type: 'simple-json', default: [] })
  rewards: RewardUserDto[];

  @Column({ type: 'simple-json', default: [] })
  boosts: BoostUserDto[];

  @OneToMany(() => GameSessionEntity, (session) => session.user, {
    cascade: true,
    eager: true, //TODO нужно поправить, не правильно во все запросы сессии юзера тянуть
  })
  sessions: GameSessionEntity[];

  @Column({ default: 0 })
  collectedItems: number;

  @Column({ default: 1 })
  level: number;

  @Column({ nullable: true })
  lastLevelUpDate: string;

  @CreateDateColumn()
  createdAt: Date;
}
